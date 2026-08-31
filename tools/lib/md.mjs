// A deliberately small Markdown reader. The manuscript only uses headings,
// paragraphs, ordered lists, horizontal rules, bold and italic, so a full
// parser would be more surface area than the job needs.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };

export function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ESC[c]);
}

export function attr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}

/** Straight quotes to typographic ones, plus ellipses. */
export function smarten(text) {
  return text
    .replace(/\.\.\./g, '…')
    .replace(/"(?=[^\s])/g, '“')
    .replace(/"/g, '”')
    .replace(/'/g, '’');
}

function inline(text) {
  return smarten(escapeHtml(text))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export { inline as inlineMd };

/**
 * Splits a chapter body into blocks. Returns an array of
 * {type, level?, text?, items?} which each renderer turns into its own markup.
 */
export function parseBlocks(body) {
  const blocks = [];
  const chunks = body.replace(/\r\n/g, '\n').trim().split(/\n{2,}/);

  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    if (lines[0] === '---') { blocks.push({ type: 'hr' }); continue; }

    const heading = lines[0].match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      continue;
    }

    if (/^\d+\.\s/.test(lines[0])) {
      const items = [];
      for (const line of lines) {
        const m = line.match(/^(\d+)\.\s+(.*)$/);
        if (m) items.push({ n: Number(m[1]), text: m[2] });
        else if (items.length) items[items.length - 1].text += ' ' + line;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    blocks.push({ type: 'p', text: lines.join(' ') });
  }
  return blocks;
}

/** Renders blocks to HTML. `h` shifts heading levels (notes get demoted). */
export function renderBlocks(blocks, { shift = 0, firstParagraph = null } = {}) {
  let seenFirst = false;
  const out = [];

  for (const b of blocks) {
    if (b.type === 'hr') { out.push('<hr />'); continue; }
    if (b.type === 'heading') {
      const level = Math.min(6, b.level + shift);
      out.push(`<h${level}>${inline(b.text)}</h${level}>`);
      continue;
    }
    if (b.type === 'ol') {
      // Items always run 1..n in order, so natural numbering is correct and
      // keeps the markup valid XHTML for the EPUB.
      const items = b.items.map((i) => `<li>${inline(i.text)}</li>`).join('\n');
      out.push(`<ol class="notes-list">\n${items}\n</ol>`);
      continue;
    }
    if (!seenFirst && firstParagraph) {
      seenFirst = true;
      out.push(firstParagraph(inline(b.text)));
      continue;
    }
    out.push(`<p>${inline(b.text)}</p>`);
  }
  return out.join('\n');
}

/**
 * Book typography for a chapter's opening paragraph: a drop capital followed by
 * the first few words in small capitals.
 */
export function openingParagraph(html) {
  const m = html.match(/^([A-Za-z“‘"])(.*)$/s);
  if (!m) return `<p class="opener">${html}</p>`;
  const rest = m[2];
  const words = rest.split(' ');
  const lead = words.slice(0, 4).join(' ');
  const tail = words.slice(4).join(' ');
  return `<p class="opener"><span class="dropcap">${m[1]}</span><span class="lead">${lead}</span> ${tail}</p>`;
}

/** Plain text, for meta descriptions and the EPUB. */
export function toPlain(text) {
  return smarten(text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1'));
}
