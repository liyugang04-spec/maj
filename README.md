# Offline Mahjong PWA

Personal local-only Mahjong bookkeeping tool built as a PWA.

## Stack
- Vite
- React
- TypeScript
- vite-plugin-pwa

## Scope
- No backend
- No login
- No cloud sync
- Data stored in browser localStorage
- Installable on Android Chrome as a standalone app

## Main Structure
- `src/components`: shared shell and layout
- `src/navigation`: top-level tabs
- `src/data`: local persistence helpers
- `src/domain`: app data types
- `src/feature/home`
- `src/feature/currentgame`
- `src/feature/history`
- `src/feature/settings`

## Local Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy To GitHub Pages
This project includes GitHub Actions auto-deploy workflow:
- Workflow file: `.github/workflows/deploy-pages.yml`
- Trigger: push to `main`
- Build output: `dist`

### One-time repo settings
1. Push code to GitHub (branch `main`).
2. Open `Settings -> Pages`.
3. In `Source`, choose `GitHub Actions`.
4. Push once to `main` again, or manually run the workflow.

After success, your site URL is:
`https://<your-username>.github.io/<your-repo-name>/`

## Android Install & Offline Check
1. Open the Pages HTTPS URL in Android Chrome.
2. Wait until the page is fully loaded once.
3. Use Chrome menu -> `Add to Home screen` or `Install app`.
4. Open from desktop icon, create/update data, then close and reopen.
5. Turn on airplane mode and reopen the app:
   pages should still open and local data should still exist.
