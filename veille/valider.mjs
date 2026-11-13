// Valide veille/veille.json avec les mêmes règles que l'app (app/src/lib/watch.ts). Usage : node veille/valider.mjs
import fs from 'node:fs';
const TOPICS = ['run', 'ride', 'strength', 'swim', 'hyrox', 'nutrition', 'recovery'];
const EVIDENCE = ['meta-analyse', 'essai', 'cohorte', 'revue', 'consensus'];
const w = JSON.parse(fs.readFileSync(new URL('./veille.json', import.meta.url), 'utf8'));
const errors = [];
if (w.version !== 1) errors.push('version doit valoir 1');
if (!/^\d{4}-\d{2}-\d{2}$/.test(String(w.updatedAt))) errors.push('updatedAt : AAAA-MM-JJ attendu');
if (!Array.isArray(w.items)) errors.push('items : tableau attendu');
const seen = new Set();
const len = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
(w.items ?? []).forEach((x, i) => {
  const at = `items[${i}] (${x?.id ?? '?'})`;
  if (!len(x.id, 60)) errors.push(`${at} : id manquant ou trop long`);
  if (seen.has(x.id)) errors.push(`${at} : id en double`);
  seen.add(x.id);
  if (!/^\d{4}-\d{2}$/.test(String(x.added))) errors.push(`${at} : added AAAA-MM attendu`);
  if (!Array.isArray(x.topics) || !x.topics.length || x.topics.some((t) => !TOPICS.includes(t))) errors.push(`${at} : topics parmi ${TOPICS.join(', ')}`);
  if (!len(x.title, 160)) errors.push(`${at} : title 1 à 160 caractères`);
  if (!len(x.takeaway, 360)) errors.push(`${at} : takeaway 1 à 360 caractères (${String(x.takeaway ?? '').length})`);
  if (!EVIDENCE.includes(x.evidence)) errors.push(`${at} : evidence parmi ${EVIDENCE.join(', ')}`);
  if (!len(x.source, 120)) errors.push(`${at} : source 1 à 120 caractères`);
  if (!len(x.url, 400) || !/^https:\/\//.test(x.url)) errors.push(`${at} : url https obligatoire`);
});
if ((w.items ?? []).length > 60) errors.push('plus de 60 entrées');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`ok — ${w.items.length} entrées, mise à jour du ${w.updatedAt}`);

// --- conseils.json (US 64) : mêmes règles que app/src/lib/tips.ts -------------------------
const c = JSON.parse(fs.readFileSync(new URL('./conseils.json', import.meta.url), 'utf8'));
const cerr = [];
const SPORTS = ['run', 'ride', 'strength', 'swim', 'hyrox', 'any'];
const STAGES = ['base', 'construction', 'specifique', 'affutage'];
const RANGES = { daysToRace: [0, 365], daysAfterRace: [0, 120], raceKm: [0, 400], planWeek: [1, 60] };
if (c.version !== 1) cerr.push('conseils : version doit valoir 1');
if (!/^\d{4}-\d{2}-\d{2}$/.test(String(c.updatedAt))) cerr.push('conseils : updatedAt AAAA-MM-JJ attendu');
const cseen = new Set();
(c.tips ?? []).forEach((t, i) => {
  const at = `tips[${i}] (${t?.id ?? '?'})`;
  if (!len(t.id, 60) || cseen.has(t.id)) cerr.push(`${at} : id manquant, trop long ou en double`);
  cseen.add(t.id);
  if (!len(t.title, 90)) cerr.push(`${at} : title 1 à 90 caractères`);
  if (!len(t.teaser, 200)) cerr.push(`${at} : teaser 1 à 200 caractères`);
  if (!len(t.body, 2400)) cerr.push(`${at} : body 1 à 2400 caractères (${String(t.body ?? '').length})`);
  if (!Array.isArray(t.sports) || !t.sports.length || t.sports.some((s) => !SPORTS.includes(s))) cerr.push(`${at} : sports parmi ${SPORTS.join(', ')}`);
  if (![1, 2, 3].includes(t.priority)) cerr.push(`${at} : priority 1, 2 ou 3`);
  const w = t.when ?? {};
  for (const [k, [lo, hi]] of Object.entries(RANGES)) {
    if (w[k] == null) continue;
    const r = w[k];
    if (!Array.isArray(r) || r.length !== 2 || r[0] > r[1] || r[0] < lo || r[1] > hi) cerr.push(`${at} : when.${k} = [min, max] entre ${lo} et ${hi}`);
  }
  if (w.stage != null && (!Array.isArray(w.stage) || w.stage.some((s) => !STAGES.includes(s)))) cerr.push(`${at} : when.stage parmi ${STAGES.join(', ')}`);
  if (t.source && (!len(t.source.label, 120) || !/^https:\/\//.test(String(t.source.url)))) cerr.push(`${at} : source { label, url https }`);
});
if ((c.tips ?? []).length > 120) cerr.push('conseils : plus de 120');
if (cerr.length) {
  console.error(cerr.join('\n'));
  process.exit(1);
}
console.log(`ok — ${c.tips.length} conseils`);
