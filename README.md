# aquaOS

A skeuomorphic recreation of early-2000s Mac OS X (Aqua era) in the
browser: glossy pill buttons, pinstripe windows, brushed metal, a
magnifying dock, draggable windows, and a translucent menu bar.

## Run locally

```sh
npm install
npm run dev
```

## Interactions

- **Right-click** the desktop (New Folder, Clean Up, Change Desktop
  Background…), desktop icons (Open, Rename, Move to Trash), and dock
  icons (Open/Show, Quit; the Trash gets Empty Trash).
- **Drag** desktop icons anywhere; drop one on the dock Trash to
  delete it. Drag on empty desktop for marquee selection; shift-click
  for multi-select.
- **Shortcuts** (⌘ or Ctrl — browsers reserve some ⌘ combos, Ctrl
  always works): W close window, M minimize, Q quit app, N new Finder
  window, ⌫ move selection to Trash. Esc closes menus.
- **Menu bar**: volume slider with interface beep, Spotlight search
  (finds apps and icons), clock dropdown, and a working Apple menu —
  Sleep, Restart and Shut Down actually run, boot screen included.
- **Windows**: double-click a title bar to minimize; green button
  zooms.
- **System Preferences** (Apple menu) changes the wallpaper and
  volume.

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
