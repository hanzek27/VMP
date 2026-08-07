import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, posix, relative, sep } from 'node:path'

/**
 * Emits `dist/sw.js` from the `tools/sw.js` template, filling in the precache
 * lists from whatever the build actually produced.
 *
 * Doing it from disk (rather than from the rollup bundle) is deliberate: the
 * question images live in `public/` and never enter the bundle, so a
 * bundle-only view of the output would miss 5 MB of the app.
 *
 * Build only – in dev there is no service worker at all, which keeps `npm run
 * dev` free of stale-cache surprises.
 */
export default function pwa({ template = 'tools/sw.js', mediaDir = 'img' } = {}) {
  let outDir = 'dist'
  let root = process.cwd()

  return {
    name: 'vmp-pwa',
    apply: 'build',

    configResolved(config) {
      root = config.root
      outDir = join(config.root, config.build.outDir)
    },

    closeBundle() {
      const files = walk(outDir).sort()
      const shell = []
      const media = []

      for (const file of files) {
        if (file === 'sw.js') continue
        ;(file.startsWith(`${mediaDir}/`) ? media : shell).push(`./${file}`)
      }

      // asset filenames carry a content hash, but public/ files do not – mix
      // the sizes in so a changed image or icon still busts the shell cache
      const version = createHash('sha256')
        .update(files.map((f) => `${f}:${statSync(join(outDir, f)).size}`).join('\n'))
        .digest('hex')
        .slice(0, 12)

      const source = readFileSync(join(root, template), 'utf8')
        .replace('__VERSION__', version)
        .replace('__SHELL__', JSON.stringify(shell, null, 2))
        .replace('__MEDIA__', JSON.stringify(media))

      writeFileSync(join(outDir, 'sw.js'), source)
      this.info(
        `sw.js: ${shell.length} shell files, ${media.length} images, version ${version}`
      )
    },
  }
}

function walk(dir, base = dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, base, out)
    else out.push(relative(base, full).split(sep).join(posix.sep))
  }
  return out
}
