# Behind the Screen

A ten-page classroom magazine about cyberbullying, with English and Arabic editions and a printed table of contents.

## Run locally

Use Node 22.12 or newer.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Use **Start reading**, the page corners, or the arrow keys. On touchscreens, swipe from the page margins. Open Contents from the cover or toolbar, or use the printed contents on page 2. In fullscreen, use the bottom-corner exit button or Escape.

```sh
npm run lint
npm run build
npm run preview
```

## Edit the magazine

- Edit the `editorial` sections in both editions. Each section includes article blocks.
- Replace each `credits` entry with the team member’s name and role. Leave `avatar` empty for an illustrated placeholder. Update `supervisor.name`, `school`, and `helpline` in both editions.



## Deploy

Build with `npm ci` and `npm run build`. Serve the generated `dist/` directory from a static host.

- **Vercel** · Import the Git repository. Leave **Root Directory** empty (not `./`). `vercel.json` runs `npm ci` / `npm run build` and publishes via Vercel’s Build Output API. No environment variables are required. Click Deploy.
- **Netlify** · Import the repository, set the build command to `npm run build`, and set the publish directory to `dist`.
- **GitHub Pages** · Choose GitHub Actions as the Pages source. In the workflow, set up Node, run `npm ci` and `npm run build`, then upload `dist` as the Pages artifact and deploy it. Vite uses a relative base so the bundle also works under the repository subpath.

## Suggested review

Check the printed contents, editorial, article examples, and back cover in both languages. Replace the credits and supervisor placeholders before sharing.
