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
