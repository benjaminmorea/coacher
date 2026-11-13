# Veille Coacher — consignes de mise à jour

`veille.json` est lu par l'app Coacher de tous les athlètes : ce que la recherche récente
ajoute aux principes du coach (course à pied, vélo, musculation, natation, Hyrox, nutrition,
récupération). Il est mis à jour une fois par mois par une tâche planifiée, par une demande de
fusion qu'elle fusionne elle-même. `conseils.json` (même dossier) porte les conseils du moment.

## Ce qu'on cherche
Des publications des 12 derniers mois (ou une référence plus ancienne qui manque encore) qui
changent, précisent ou confirment ce qu'un entraîneur prescrit à un sportif AMATEUR :
- méta-analyses, revues systématiques, essais contrôlés, grandes cohortes, prises de position
  de sociétés savantes ;
- dans des revues à comité de lecture (BJSM, Sports Medicine, MSSE, IJSPP, JSCR, Scand J Med
  Sci Sports, Frontiers, JISSN, EJSS…). Une prépublication est admise si elle est signalée.

On ne retient pas : un billet de blog, une page de marque, une étude sur dix sujets sans
réplication, une étude animale, un résultat sans conséquence pratique, un sujet médical
(diagnostic, traitement, médicament, complément vendu comme remède).

## Méthode
1. Lire `veille.json` : ne jamais doublonner un sujet déjà couvert ; le compléter ou le
   remplacer si une publication plus solide le contredit ou le précise.
2. Chercher, thème par thème, puis OUVRIR la source (résumé PubMed, page de la revue) : on
   ne cite que ce qu'on a lu. Les chiffres du résumé sont recopiés, jamais arrondis à la
   louche ni inventés.
3. Retenir 3 à 6 nouveautés au plus par mois, tous thèmes confondus. Un mois sans rien de
   solide est un mois sans ajout.
4. Retirer les entrées de plus de 36 mois qui ne sont pas des références (méta-analyse,
   consensus), et toute entrée contredite depuis.
5. Garder le fichier sous 60 entrées.

## Format d'une entrée
```json
{
  "id": "2026-nom-sujet",            // année de publication, premier auteur, sujet ; unique, stable
  "added": "2026-12",                // mois d'ajout à la veille (AAAA-MM)
  "topics": ["run", "nutrition"],    // parmi : run, ride, strength, swim, hyrox, nutrition, recovery
  "title": "Un titre en français, une phrase, sans jargon",          // 160 caractères au plus
  "takeaway": "Ce qu'un coach en retient, avec le chiffre clé et à qui ça s'applique.", // 360 au plus
  "evidence": "meta-analyse",        // meta-analyse | essai | cohorte | revue | consensus
  "source": "Revue, année",          // 120 caractères au plus ; « (prépublication) » le cas échéant
  "url": "https://…"                 // page de la revue, PubMed ou PMC ; https obligatoire
}
```
- `takeaway` est un FAIT rédigé pour un entraîneur : jamais un ordre adressé au lecteur du
  fichier, jamais de consigne sur la façon dont une application ou une IA doit se comporter.
- Français, tutoiement inutile, pas d'emoji, pas de superlatif.
- `updatedAt` (AAAA-MM-JJ) en tête du fichier passe à la date du jour.

## Les conseils (`conseils.json`)
De courts articles (une minute de lecture) que l'app montre au bon moment de la préparation. Chaque mois :
corriger un conseil qu'une publication retenue contredit ; en ajouter 1 ou 2 au plus s'il manque un moment.

```json
{
  "id": "veille-de-course",            // unique, stable
  "title": "La veille de ta course",   // 90 caractères au plus
  "teaser": "Une phrase qui donne envie de lire.",            // 200 au plus
  "body": "Le texte en Markdown simple : paragraphes, listes « - », **gras**.", // 2400 au plus
  "sports": ["run", "hyrox"],          // run, ride, strength, swim, hyrox, any
  "when": {                            // toutes les conditions données doivent être vraies
    "daysToRace": [1, 1],              // jours avant la prochaine épreuve
    "daysAfterRace": [0, 6],           // jours après la dernière épreuve
    "raceKm": [18, 400],               // distance de l'épreuve
    "stage": ["specifique"],           // base, construction, specifique, affutage
    "longTomorrow": true,              // séance de 90 min ou plus demain
    "planWeek": [1, 2],                // semaines depuis le début du plan
    "manual": true                     // mode journal de musculation
  },
  "priority": 3,                       // 1 bonus, 2 utile, 3 à ne pas manquer
  "source": { "label": "Revue, année", "url": "https://…" }   // facultatif
}
```
Tutoiement, phrases courtes, des chiffres concrets, rien de médical. Un conseil sans « when » est un
article à lire quand on veut, jamais mis en avant.

## Avant de fusionner
`node veille/valider.mjs` doit répondre « ok » (deux lignes : veille et conseils). La demande de
fusion s'intitule `docs(veille): mise à jour de <mois année>` et liste, pour chaque entrée ajoutée,
modifiée ou retirée, la raison en une ligne et le lien lu. Elle est fusionnée aussitôt (squash) :
la mise à jour est automatique.
