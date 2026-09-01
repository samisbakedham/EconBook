#!/usr/bin/env bash
# Regenerates docs/ (the published site) from manuscript/ (the source of truth).
# The outline is working material and is deliberately not published.
set -euo pipefail
cd "$(dirname "$0")"

rm -rf docs/chapters && mkdir -p docs/chapters

# Every numbered manuscript file except the outline, in order. Globbing by
# explicit number ranges broke silently when a chapter was inserted.
files=()
for f in manuscript/[0-9][0-9]-*.md; do
  case "$(basename "$f")" in 00-*) continue ;; esac
  files+=("$f")
done
slugs=(); titles=(); nums=()

for f in "${files[@]}"; do
  base=$(basename "$f" .md)
  slug=${base#*-}
  num=$(sed -n '1s/^# Chapter \([0-9]*\)$/\1/p' "$f")
  if [ -n "$num" ]; then
    title=$(grep -m1 '^## ' "$f" | sed 's/^## //')
  else
    title="Notes"
  fi
  slugs+=("$slug"); titles+=("$title"); nums+=("$num")
done

n=${#files[@]}
for i in "${!files[@]}"; do
  f=${files[$i]}; slug=${slugs[$i]}; title=${titles[$i]}; num=${nums[$i]}
  prev=""; next=""
  [ "$i" -gt 0 ] && prev="/chapters/${slugs[$((i-1))]}.html"
  [ "$i" -lt $((n-1)) ] && next="/chapters/${slugs[$((i+1))]}.html"

  out="docs/chapters/${slug}.md"
  {
    echo "---"
    echo "layout: chapter"
    echo "title: \"${title}\""
    [ -n "$num" ] && echo "chapnum: ${num}"
    [ -n "$prev" ] && echo "prev: \"${prev}\""
    [ -n "$next" ] && echo "next: \"${next}\""
    echo "permalink: /chapters/${slug}.html"
    echo "---"
    echo
    if [ -n "$num" ]; then
      # drop the "# Chapter N" line and the first "## Title" line; keep the rest
      awk 'NR==1 && /^# Chapter /{next} !seen && /^## /{seen=1; next} {print}' "$f"
    else
      # notes: drop the "# Notes" line, demote its chapter headings one level
      awk 'NR==1 && /^# /{next} {print}' "$f" | sed 's/^## /### /'
    fi
  } > "$out"
  echo "  built ${out}"
done
echo "Done. ${n} pages."
