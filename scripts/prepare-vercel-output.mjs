import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'

if (!existsSync('dist')) {
  console.error('dist/ is missing after vite build')
  process.exit(1)
}

const out = '.vercel/output'
rmSync(out, { recursive: true, force: true })
mkdirSync(`${out}/static`, { recursive: true })
cpSync('dist', `${out}/static`, { recursive: true })
writeFileSync(
  `${out}/config.json`,
  JSON.stringify({
    version: 3,
    routes: [
      { handle: 'filesystem' },
      { src: '/(.*)', dest: '/index.html' },
    ],
  }),
)

console.log('Prepared .vercel/output for Vercel Build Output API')
