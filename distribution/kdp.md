# Publishing the paperback on Amazon KDP

Everything here is produced by `npm run build:book`. Nothing needs to be made by
hand, and nothing should be edited in `build/` because it is overwritten.

## Files to upload

| KDP asks for | Use |
|---|---|
| Manuscript | `build/book/terminal-value-interior-6x9.pdf` |
| Book cover | `build/book/terminal-value-kdp-cover.png` |

## Settings that must match the files

These are not preferences. If they disagree with the uploaded files, KDP rejects
the submission or prints something wrong.

- **Trim size:** 6 x 9 in
- **Bleed:** No bleed. The interior has none.
- **Paper:** Cream. The spine width in the cover file is computed at 0.0025 in
  per page, which is the cream figure. Choosing white paper makes the spine
  slightly too wide and the wrap will not align.
- **Ink:** Black and white
- **Cover finish:** Matte suits a dark cover. Gloss will show fingerprints.

## Why the spine width is what it is

The cover is regenerated from the interior's own page count on every build, so
the two cannot drift apart. The build prints the number it used.

The interior currently runs to an odd number of pages. KDP silently adds a blank
to make it even, so the cover is sized for that even count rather than the
number the build reports for the PDF. This is handled automatically.

**If the manuscript changes, rebuild both files.** A cover sized for the old page
count will be visibly misaligned on the printed spine.

## Margins

KDP's minimum inside margin depends on page count. At 151 to 300 pages it is
0.5 in. The interior uses 0.68 in on both sides, which clears it with room to
spare, and the same margin on both sides means the text block sits centred
rather than shifted toward the gutter.

## The barcode

The pale rectangle at the lower right of the back cover is a keep-clear zone,
2 x 1.2 in, where Amazon prints the barcode. Leave it. Nothing should be moved
into it.

## Metadata

Title, subtitle, author and description are in `tools/lib/book.mjs` under
`meta`, and the back cover copy is in `tools/lib/cover.mjs`. The blurb on the
back of the printed cover and the description on the Amazon listing should say
the same thing, so change them together.

## Before you click publish

The book is a complete draft that says so on its own copyright page and in its
notes. That is a deliberate choice, not an oversight, but it is worth deciding
whether a paid Amazon listing is the right place for a text that describes
itself that way. The counts are in the notes and on the site.
