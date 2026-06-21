# Spec: Briefings Field App
**Single-file HTML app generated from a folder of Markdown files.**

---

## Overview

A build script reads a folder of `.md` files, converts each to HTML, and bundles everything into a single self-contained `app.html` file. The output file runs entirely offline in a mobile browser — no server, no CDN, no runtime dependencies. Images remain as remote URLs and degrade gracefully if there is no internet connection.

---

## Build Script

**Language:** Python (stdlib only — no pip dependencies).

**Invocation:**
```
python brfmaker.py -i <input_dir> -o <output_file>
```

Examples:
```
python brfmaker.py -i input/basco -o output/basco.html
python brfmaker.py -i input/pico  -o output/pico.html
```

**Project layout:**
```
brfmaker.py
input/
  basco/
    00-index.md
    01-briefing-inicial.md
    ...
  pico/
    00-index.md
    ...
output/
  basco.html
  pico.html
```

**Input:** a flat folder of `.md` files inside `input/`.

**Processing order:** alphabetical by filename (filenames are zero-padded numbers so alphabetical = correct reading order).

**Per-file processing:**
- Parse Markdown to HTML at build time using Python's `markdown` library (`pip install markdown`) with the `tables` and `fenced_code` extensions enabled.
- Preserve all image tags with their original `src` URLs (no embedding, no rewriting).
- Wrap each file's HTML in a `<article data-id="N">` element where N is the zero-based index.

**Output:** a single `app.html` file containing:
- All article HTML inlined
- App shell (status bar, ToC overlay)
- All JavaScript inlined
- No external dependencies

---

## App Shell

The HTML file contains:

```
┌─────────────────────────────────┐
│  [≡]   filename.md   [‹] [›]   │  ← status bar (fixed, top)
├─────────────────────────────────┤
│                                 │
│   article content               │  ← scrollable content area
│                                 │
└─────────────────────────────────┘
```

**Status bar (fixed, always visible):**
- Left: `≡` button — opens/closes ToC overlay
- Centre: current filename (e.g. `20-d2.md`)
- Right: `‹` (previous) and `›` (next) buttons

**Content area:**
- Displays one article at a time
- Vertically scrollable
- Browser default CSS — no custom fonts, no colour overrides, no framework

---

## Navigation

### Prev / Next buttons
- Go to previous or next file in alphabetical order
- Wraps: next on last file goes to first; prev on first goes to last
- Scrolls content area back to top on each navigation

### Swipe gesture
- Horizontal swipe on the content area triggers prev (swipe right) or next (swipe left)
- Threshold: minimum 50px horizontal travel, maximum 100px vertical travel (to avoid triggering during normal scroll)
- Implemented with `touchstart` / `touchend` events

### ToC overlay
- Triggered by `≡` button
- Full-screen overlay on top of content
- Simple flat list: one item per file, showing filename
- Tap any item → close overlay → navigate to that file
- Close also via a visible `✕` button or tap outside the list

---

## State Persistence

- On each navigation event, save current file index to `localStorage` key `briefings_current`
- On app load, restore last position from `localStorage` (default to index 0 if not set)

---

## Offline Behaviour

- All text content and navigation work fully offline
- Images in articles use their original remote URLs and will not display without internet — this is acceptable
- No fallback placeholder needed

---

## File & Output Details

**Input folder structure (example):**
```
input/basco/
  00-index.md
  01-briefing-inicial.md
  03-historia-basca.md
  04-eta.md
  ...
  90-altimetria.md
  91-media.md
```

**Output:** a single `output/basco.html` — one file per trip, no companion assets. The output path is whatever is passed via `-o`; the script does not enforce the `output/` prefix but that is the convention.

**Target environment:** Mobile Safari / Chrome on iOS or Android. Must work when opened directly from the filesystem (i.e. `file://` protocol — no `localhost` required).

---

## Out of Scope (for now)

- Search
- Dark mode toggle
- Font size control
- Section grouping in ToC (flat list only)
- Image embedding / base64
- PWA / service worker
