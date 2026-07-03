# aquaOS

A skeuomorphic recreation of early-2000s Mac OS X (Aqua era) in the
browser: glossy pill buttons, pinstripe windows, brushed metal, a
magnifying dock, draggable windows, and a translucent menu bar.

## Run locally

```sh
npm install
npm run dev
```

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
