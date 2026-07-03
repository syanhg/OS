# aquaOS

A skeuomorphic recreation of early-2000s Mac OS X (Aqua era) in the
browser: glossy pill buttons, pinstripe windows, brushed metal, a
magnifying dock, draggable windows, and a translucent menu bar.

## Run locally

```sh
npm install
npm run dev
```

## Project layout

```
public/icons/       World of Aqua Vol. 1 icon set (PNG) + alias copies
src/
  main.tsx          entry point
  types.ts          shared types (AppId, AppDef, WinState)
  components/       OS chrome: Desktop, MenuBar, Dock, Window, AppIcon
  apps/             one file per app + registry.tsx (the app roster)
  data/             generated icon manifest
  styles/           aqua CSS, split by concern (base/chrome/window/apps)
```

To add an app: create `src/apps/YourApp.tsx`, register it in
`src/apps/registry.tsx`, and (optionally) add it to `DOCK_APPS` in
`src/components/Dock.tsx`.

## Add your own artwork

- **App icons** — drop PNGs into [`public/icons/`](public/icons/README.md);
  they replace the built-in placeholders automatically.
- **Wallpaper** — drop a `wallpaper.jpg` into `public/`.

## Deploy to GitHub Pages (static)

The site builds to plain static files with relative asset paths, so it
works at `https://<user>.github.io/<repo>/` with zero configuration.

1. Push this repo to GitHub (branch `main`).
2. In the repo: **Settings → Pages → Source → GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and
   deploys on every push to `main`.

To build by hand instead: `npm run build` → static site in `dist/`.
