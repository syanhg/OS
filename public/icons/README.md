# Icons

This folder holds the World of Aqua Vol. 1 icon set (Iconfactory),
extracted from the original resource-fork `Icon\r` files and converted
to 128×128 PNGs, plus alias copies used by the app:

| Alias file         | Source icon        | Used for                    |
| ------------------ | ------------------ | --------------------------- |
| `finder.png`       | AquaOS             | Finder (dock)               |
| `mail.png`         | eMail Blue         | Mail (dock)                 |
| `browser.png`      | Browser            | Browser (dock)              |
| `simpletext.png`   | SimpleText         | SimpleText (dock)           |
| `quicktime.png`    | Quicktime          | QuickTime Player (dock)     |
| `appletstore.png`  | IconDropper X      | Applet Store (desktop/dock) |
| `trash.png`        | Trash (Empty)      | Trash (dock)                |
| `trash-full.png`   | Trash (Full)       | (reserved)                  |
| `hd.png`           | G4                 | Macintosh HD (desktop)      |
| `osxcd.png`        | OS X CD            | Mac OS X CD (desktop)       |
| `osx.png`          | OS X               | About This Mac              |
| `folder-*.png`     | themed folders     | Finder sidebar & files      |

To swap any icon, overwrite the alias PNG. Any PNG that goes missing
falls back to a built-in placeholder. The full collection is listed in
`src/icon-manifest.ts` and browsable in the Applet Store app.

World of Aqua is © the Iconfactory — personal-use recreation only.

Wallpaper: put a `wallpaper.jpg` in `public/` to replace the default
Aqua-blue gradient.
