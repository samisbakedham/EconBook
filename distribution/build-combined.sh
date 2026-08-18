#!/usr/bin/env bash
# Builds a single combined Markdown file, plus PDF and EPUB if pandoc is present.
# Output lands in distribution/out/.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p distribution/out
OUT=distribution/out/terminal-value

{
  echo "% Terminal Value: What Death Was Doing for the Economy, and What Happens When We Stop It"
  echo "% Samuel Safahi"
  echo "% $(date +%B\ %Y)"
  echo
  for f in manuscript/0[1-9]-*.md manuscript/1[0-2]-*.md manuscript/13-notes.md; do
    cat "$f"; echo; echo; echo '\newpage'; echo
  done
} > "${OUT}.md"

words=$(wc -w < "${OUT}.md")
echo "Combined: ${OUT}.md (${words} words)"

if command -v pandoc >/dev/null 2>&1; then
  pandoc "${OUT}.md" -o "${OUT}.epub" --toc --toc-depth=2 \
    --metadata title="Terminal Value" --metadata author="Samuel Safahi"
  echo "EPUB:     ${OUT}.epub"
  if pandoc "${OUT}.md" -o "${OUT}.pdf" --toc --toc-depth=2 \
      -V geometry:margin=1.2in -V fontsize=11pt -V linkcolor=black 2>/dev/null; then
    echo "PDF:      ${OUT}.pdf"
  else
    echo "PDF:      skipped (needs a LaTeX engine: brew install basictex)"
  fi
else
  echo "EPUB/PDF: skipped (brew install pandoc)"
fi
