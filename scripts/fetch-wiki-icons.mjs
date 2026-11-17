#!/usr/bin/env node
/**
 * Fetch missing skill icons from wiki.guildwars.com.
 *
 * Reads all skill names from sql/gw1_skilldesc_en.sql, checks
 * public/gw_images_large/ for matching files, and downloads any missing
 * icons via the wiki's MediaWiki API.
 *
 * Icon resolution order:
 *   1. File:<Name> (large).jpg  — hi-res variant (matches existing files)
 *   2. File:<Name>.jpg          — standard icon fallback
 *
 * Files are saved under the existing naming convention
 * `100px-<Name_with_underscores>_(large).jpg` so `parseSkillName` resolves
 * them unchanged.
 *
 * Usage: node scripts/fetch-wiki-icons.mjs
 */
import fs from 'fs';
import path from 'path';

const API = 'https://wiki.guildwars.com/api.php';
const OUT_DIR = path.join(process.cwd(), 'public', 'gw_images_large');
const SQL_FILE = path.join(process.cwd(), 'sql', 'gw1_skilldesc_en.sql');
const THROTTLE_MS = 150;

function skillNames() {
  const sql = fs.readFileSync(SQL_FILE, 'utf8');
  const body = sql.slice(sql.indexOf('VALUES'));
  const names = new Set();
  const rowRe = /\((\d+),\s*'((?:[^']|'')*)'/g;
  let m;
  while ((m = rowRe.exec(body))) {
    names.add(m[2].replace(/''/g, "'"));
  }
  return [...names];
}

function fileName(name) {
  return `100px-${name.replace(/ /g, '_')}_(large).jpg`;
}

async function apiQuery(titles) {
  const url = `${API}?action=query&format=json&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(titles)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'gwbar-icon-sync (github.com/addiinnocent/gwbar)' } });
  if (!res.ok) throw new Error(`API ${res.status} for ${titles}`);
  const data = await res.json();
  const out = {};
  for (const page of Object.values(data.query.pages)) {
    out[page.title] = page.missing === undefined ? page.imageinfo?.[0]?.url ?? null : null;
  }
  return out;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'gwbar-icon-sync (github.com/addiinnocent/gwbar)' } });
  if (!res.ok) throw new Error(`download ${res.status} for ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const missing = skillNames().filter((name) => !fs.existsSync(path.join(OUT_DIR, fileName(name))));
  console.log(`${missing.length} missing icons`);

  let ok = 0;
  const failed = [];

  // resolve file URLs in batches of 8 (API allows batching)
  for (let i = 0; i < missing.length; i += 8) {
    const batch = missing.slice(i, i + 8);
    const titles = batch
      .map((n) => `File:${n} (large).jpg`)
      .concat(batch.map((n) => `File:${n}.jpg`))
      .join('|');
    const urls = await apiQuery(titles);

    for (const name of batch) {
      const dest = path.join(OUT_DIR, fileName(name));
      const url = urls[`File:${name} (large).jpg`] ?? urls[`File:${name}.jpg`];
      if (!url) {
        failed.push(name);
        continue;
      }
      try {
        await download(url, dest);
        ok++;
        console.log(`ok  ${name}`);
      } catch (e) {
        failed.push(name);
        console.error(`err ${name}: ${e.message}`);
      }
      await sleep(THROTTLE_MS);
    }
  }

  console.log(`\ndownloaded ${ok}, failed ${failed.length}`);
  if (failed.length) console.log(failed.join('\n'));
  process.exit(failed.length ? 1 : 0);
}

main();
