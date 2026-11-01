// Build the app and the presentation and publish both to the gh-pages branch.
//   app          -> https://raush-acharya.github.io/tyokina/
//   case study   -> https://raush-acharya.github.io/tyokina/case-study/
// Needs: git with push access to the repo, and GitHub Pages set to "Deploy from a branch: gh-pages / root".
//   node scripts/publish.mjs
import { execSync } from 'node:child_process'
import { cpSync, rmSync, mkdirSync, readdirSync, copyFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const csDir = resolve(import.meta.dirname, '..')
const appDir = resolve(csDir, '..')
const remote = execSync('git remote get-url origin', { cwd: appDir }).toString().trim()
const work = mkdtempSync(join(tmpdir(), 'tyokina-pages-'))
const site = join(work, 'site')
const sh = (cmd, cwd) => { console.log('>', cmd); execSync(cmd, { cwd, stdio: 'inherit' }) }

// 1. the app, twice: the copy embedded in the presentation's phones, and the public app itself
sh(`npx vite build --base=./ --outDir "${join(csDir, 'public/app')}" --emptyOutDir`, appDir)
sh(`npx vite build --base=./ --outDir "${site}" --emptyOutDir`, appDir)
// 2. the presentation (it picks up public/app, public/figma)
sh(`npx vite build --outDir "${join(site, 'case-study')}" --emptyOutDir`, csDir)
writeFileSync(join(site, '.nojekyll'), '')
copyFileSync(join(site, 'index.html'), join(site, '404.html'))

// 3. replace the contents of a fresh checkout of gh-pages (or start it) and push
const repo = join(work, 'repo')
try { sh(`git clone --branch gh-pages --depth 1 "${remote}" "${repo}"`, work) } catch {
  mkdirSync(repo); sh('git init -q -b gh-pages', repo); sh(`git remote add origin "${remote}"`, repo)
}
for (const f of readdirSync(repo)) if (f !== '.git') rmSync(join(repo, f), { recursive: true, force: true })
cpSync(site, repo, { recursive: true })
sh('git add -A', repo)
const changed = execSync('git status --porcelain', { cwd: repo }).toString().trim()
if (!changed) console.log('Nothing changed, nothing to publish.')
else {
  sh('git -c user.name="TyoKina publish" -c user.email="publish@users.noreply.github.com" commit -q -m "Publish TyoKina app and case study"', repo)
  sh('git push -u origin gh-pages', repo)
  console.log('\nPublished:\n  app          https://raush-acharya.github.io/tyokina/\n  case study   https://raush-acharya.github.io/tyokina/case-study/')
}
rmSync(work, { recursive: true, force: true })
