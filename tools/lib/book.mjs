// The manuscript is the single source of truth. Everything downstream (the
// website, the print interior, the SSRN paper) reads the book through here.
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseBlocks, toPlain } from './md.mjs';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const MANUSCRIPT = path.join(ROOT, 'manuscript');

export const meta = {
  title: 'Terminal Value',
  subtitle: 'What Death Was Doing for the Economy, and What Happens When We Stop It',
  author: 'Samuel Safahi',
  year: new Date().getFullYear(),
  siteUrl: 'https://econ-book.vercel.app',
  repo: 'https://github.com/samisbakedham/EconBook',
  isbn: '',
  description:
    'Mortality is load bearing economic infrastructure. It sets the discount rate, turns over capital, turns over ideas, prices risk, and creates vacancy. Radical life extension removes all five at once, and none of them has a backup.',
};

export const parts = [
  {
    n: 'I',
    title: 'The Unexamined Constant',
    chapters: [1, 2],
    blurb: 'Every economic model contains a hidden constant. The agents die. Nobody has ever had to ask what that assumption was holding up, because the number has never moved.',
  },
  {
    n: 'II',
    title: 'The Five Jobs',
    chapters: [3, 4, 5, 6, 7],
    blurb: 'Death sets the price of time, turns over capital, turns over ideas, prices risk, and creates vacancy. One chapter each. None of the five has a backup.',
  },
  {
    n: 'III',
    title: 'The Counterparty',
    chapters: [8, 9],
    blurb: 'Artificial agents are the first economic actors with genuinely arbitrary lifespans. The mortality we are removing from people becomes available, somewhere else, as a design setting.',
  },
  {
    n: 'IV',
    title: 'The Frozen World',
    chapters: [10],
    blurb: 'What all five removals look like operating at once. Not collapse. Venice, which stayed rich and beautiful for five hundred years and stopped mattering.',
  },
  {
    n: 'V',
    title: 'Designed Turnover',
    chapters: [11, 12],
    blurb: 'If death was doing five jobs and death is going away, the jobs still have to get done. Deliberately, by institution, in the open, and only while nobody knows which side they will be on.',
  },
];

/** One line per chapter, used on the contents page and in link previews. */
export const chapterBlurbs = {
  1: 'Infinite horizon models misbehave. Economists patch them with an assumption that value must eventually go to zero. That patch is death, smuggled back in.',
  2: 'The premise, set as weakly as it can be set. Not immortality. Healthy lifespans somewhere between 150 and 300 years, with the promotional material discounted.',
  3: 'A bond written on goatskin in 1648 still pays. The discount rate contains a term for the chance you will not be there to collect, and it has been falling for forty years.',
  4: 'Inheritance is the largest redistribution in any market economy and nobody voted for it. Five percent for two hundred years is a factor of seventeen thousand.',
  5: 'Four hundred and fifty two elite scientists died unexpectedly. Outsiders moved into their fields and published work that was more novel and more cited. The effect did not fade.',
  6: 'The value of a life rises with wealth and with years remaining. Every civilization rich enough to reach the stars is too rich to go.',
  7: 'Careers are queues, and queues move because people leave them. The young in American biomedical science went from a fifth of the field to a twentieth.',
  8: 'An artificial agent’s lifespan is a setting in a configuration file. Every job death was doing is available here as an option, deliberately, at low cost.',
  9: 'Property goes to whoever bears the cost of getting there. The money and the hands are about to be separated by light minutes, which is how the East India Company happened.',
  10: 'In 1297 Venice closed the door behind itself. It stayed rich, safe and beautiful for another five centuries, and nothing further happened.',
  11: 'Ownership becomes a lease. Authority becomes a term. Everything death used to take back by force, we will have to take back by contract.',
  12: 'Most of what anything is worth lies beyond the forecast horizon. Every generation until now was forced into a relationship with a future it would not see.',
};

/** The one line from each chapter worth putting on a wall. */
export const pullQuotes = {
  1: 'We are removing a beam. The beam was holding something up. Nobody has checked what.',
  2: 'Assume a longer life. Not forever. Just longer. Then follow the money.',
  3: 'At zero, there is no answer. Not a very large answer. No answer.',
  4: 'Five percent for two hundred years is a factor of seventeen thousand. Just continuity.',
  5: 'There is no bad actor to remove. There is only the ordinary operation of authority.',
  6: 'Longevity buys you Earth. The stars go to whoever is still willing to die.',
  7: 'You have not slowed anyone’s ascent. You have removed the reason to begin.',
  8: 'We are removing mortality from one side of the economy and inventing it on the other.',
  9: 'Whoever can afford to die there ends up holding it.',
  10: 'Five centuries of pleasant, wealthy, decorated stasis. Nothing further happened.',
  11: 'Everything death used to take back by force, we will have to take back by contract.',
  12: 'We may be the first generation that gets to see the future it paid for.',
};

/**
 * The notes carry their own tally in a "Verification status" section. Reading
 * it here means the book, the paper and the site all quote the same numbers,
 * and none of them goes stale when the verification pass moves on.
 */
export function parseVerification(raw) {
  const num = (re) => {
    const m = raw.match(re);
    return m ? Number(m[1].replace(/,/g, '')) : null;
  };
  const v = {
    verified: num(/Verified against sources:\s*([\d,]+)\s*items?/i),
    unverified: num(/Still unverified:\s*([\d,]+)\s*items?/i),
    flagged: num(/Flagged as my own calculation[^:]*:\s*([\d,]+)\s*items?/i),
  };
  if (v.verified == null || v.unverified == null) {
    throw new Error('Could not read the verification tally from manuscript/13-notes.md');
  }
  v.total = v.verified + v.unverified;
  return v;
}

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Reads manuscript/*.md and returns ordered chapters plus the notes.
 * A chapter file starts "# Chapter N" then "## Title".
 */
export async function loadBook() {
  const files = (await readdir(MANUSCRIPT))
    .filter((f) => /^\d\d-.*\.md$/.test(f) && !f.startsWith('00-'))
    .sort();

  const chapters = [];
  let notes = null;

  for (const file of files) {
    const raw = await readFile(path.join(MANUSCRIPT, file), 'utf8');
    const lines = raw.replace(/\r\n/g, '\n').split('\n');

    const numMatch = lines[0].match(/^# Chapter (\d+)\s*$/);
    if (!numMatch) {
      // 13-notes.md: "# Notes", with per-chapter "## Chapter N. Title" sections.
      const body = lines.slice(1).join('\n');
      notes = {
        kind: 'notes',
        slug: 'notes',
        title: 'Notes',
        file,
        raw,
        blocks: parseBlocks(body),
      };
      continue;
    }

    const titleIdx = lines.findIndex((l) => /^## /.test(l));
    const title = lines[titleIdx].replace(/^##\s+/, '').trim();
    const body = lines.slice(titleIdx + 1).join('\n');
    const blocks = parseBlocks(body);
    const firstPara = blocks.find((b) => b.type === 'p');

    chapters.push({
      kind: 'chapter',
      n: Number(numMatch[1]),
      title,
      slug: slugify(title),
      file,
      blocks,
      words: body.split(/\s+/).filter(Boolean).length,
      excerpt: firstPara ? toPlain(firstPara.text) : '',
      blurb: chapterBlurbs[Number(numMatch[1])] || '',
      quote: pullQuotes[Number(numMatch[1])] || '',
    });
  }

  chapters.sort((a, b) => a.n - b.n);

  for (const part of parts) part.items = part.chapters.map((n) => chapters.find((c) => c.n === n));

  const flow = [...chapters, notes];
  flow.forEach((item, i) => {
    item.prev = i > 0 ? flow[i - 1] : null;
    item.next = i < flow.length - 1 ? flow[i + 1] : null;
  });

  const words = chapters.reduce((sum, c) => sum + c.words, 0);
  const verification = parseVerification(notes.raw);
  return { meta, parts, chapters, notes, flow, words, verification };
}

export { slugify };
