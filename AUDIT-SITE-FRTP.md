# Audit du site internet FRTP

Audit technique et éditorial du futur site `frtp.fr` / `frtp83.fr`
Code analysé : application Next.js 16 (App Router) + React 19 + Supabase + Tailwind + GSAP
Date : 5 juin 2026

---

## 1. Synthèse

Le site est bien construit techniquement : architecture Next.js propre, séparation claire des données (fichiers de secours + base Supabase), back-office « Studio » complet pour gérer contenus, chantiers, actualités et demandes, et un design soigné et cohérent (charte bleu/orange, typographies, sections animées).

Mais **il n'est pas prêt pour une mise en production en l'état.** Trois problèmes sont bloquants : une clé secrète Supabase exposée dans le dépôt, un contrôle d'accès administrateur trop permissif, et des contenus légaux/contacts encore à l'état de remplissage. À cela s'ajoutent des manques importants en SEO et en performance qui pénaliseront le référencement local — précisément l'objectif d'un site pour une entreprise de travaux publics.

Hiérarchie des actions :

- **Bloquant (à corriger avant toute mise en ligne)** : secret exposé, droits admin, mentions légales, faux avis, coordonnées réelles.
- **Important (avant ou juste après le lancement)** : SEO (métadonnées, sitemap, données structurées), performance des images, accents français.
- **Améliorations** : anti-spam du formulaire, accessibilité fine, robustesse du back-office.

---

## 2. Sécurité — points bloquants

### 2.1 Clé secrète Supabase exposée ⚠️ CRITIQUE

Le fichier `.env.local` contient la clé **service role** de Supabase en clair :

```
SUPABASE_SERVICE_ROLE_KEY=<a renseigner hors GitHub>
```

Cette clé **contourne toutes les règles de sécurité (RLS)** de la base : quiconque l'obtient peut lire, modifier et supprimer l'intégralité des données, y compris toutes les demandes de contact (données personnelles de prospects). Le fichier est certes listé dans `.gitignore`, mais il est physiquement présent dans le dossier de travail ; tout partage de dossier, sauvegarde, archive ou copie le diffuse.

Actions :
- **Révoquer et régénérer immédiatement** la clé service role depuis le tableau de bord Supabase (et la clé anonyme par précaution).
- Ne jamais committer ni partager `.env.local`. Renseigner les secrets uniquement dans les variables d'environnement de l'hébergeur (Vercel).
- Vérifier que la clé n'a jamais été poussée dans un historique Git (`git log` / scan de secrets) ; si oui, considérer la base comme compromise.

### 2.2 Droits administrateur trop permissifs ⚠️

L'authentification admin repose sur Supabase Auth (`signInWithPassword`), mais **aucune notion de rôle « administrateur » n'existe**. Les règles RLS du schéma (`supabase/schema.sql`) accordent la gestion complète à `to authenticated using (true)` — c'est-à-dire à **n'importe quel compte connecté**. De même, la route `app/api/admin/studio/route.ts` se contente de vérifier que le jeton correspond à un utilisateur valide, sans contrôler qui il est.

Conséquence : si l'inscription est ouverte sur le projet Supabase, un visiteur peut se créer un compte et obtenir un accès total au back-office (modification du site, lecture de toutes les demandes de contact). Risque RGPD et défiguration.

Actions :
- Désactiver les inscriptions publiques dans Supabase (Auth → Providers → « Enable sign-ups » à off), ne créer les comptes admin qu'à la main.
- Mieux : ajouter une vraie notion de rôle (table `admins` ou claim `role=admin`) et restreindre les policies RLS et la route API à ce rôle, plutôt que `using (true)`.

### 2.3 Formulaire de contact sans protection anti-spam

`app/api/contact/route.ts` insère chaque envoi en base (via la clé service role) et déclenche un email, **sans limitation de débit, ni captcha, ni champ piège (honeypot), ni limite de taille des champs**. Un robot peut donc saturer la table `contact_requests` et faire partir des centaines d'emails.

Actions : ajouter un honeypot invisible et/ou un captcha léger (hCaptcha, Turnstile), une limite de débit par IP, et borner la longueur des champs (ex. message ≤ 4000 caractères). Valider aussi le format de l'email côté serveur.

### 2.4 Page `/admin` indexable

La page `/admin` est accessible publiquement (le contenu est protégé, mais l'URL est référençable). Ajouter un `noindex` et l'exclure du sitemap/robots.

---

## 3. Conformité légale et contenu — points bloquants

### 3.1 Mentions légales incomplètes (obligation légale)

Le contenu par défaut (`lib/studio.ts`) indique explicitement « informations sociétaires complètes à renseigner », « responsable de publication : à renseigner ». Or, en France, les mentions légales d'un site professionnel sont **obligatoires** et doivent comporter : dénomination (FRTP), forme juridique (SASU), capital (20 000 €), siège (51 rue Girardin, 83600 Fréjus), **SIREN 980 664 080 / RCS**, numéro de TVA intracommunautaire, directeur de la publication, et coordonnées de l'hébergeur. À compléter avant mise en ligne.

### 3.2 Politique de confidentialité incomplète (RGPD)

Le texte mentionne « durée de conservation, responsable de traitement et contact RGPD à compléter ». Le formulaire collecte nom, société, email, téléphone, commune et message : il faut une politique RGPD complète (finalité, base légale, durée de conservation, droits d'accès/suppression, contact). Idéalement une case de consentement explicite sur le formulaire.

### 3.3 Faux avis clients « Google » ⚠️

La page d'accueil affiche trois témoignages signés « Client FRTP » avec une note de **5,0** présentés comme des **« Avis Google »**, alors que ce sont des textes par défaut inventés (`lib/studio.ts`). Publier de faux avis est une **pratique commerciale trompeuse** (sanctionnable, DGCCRF) et entame la crédibilité. Remplacer par de vrais avis Google (ou retirer la section tant qu'il n'y en a pas).

### 3.4 Coordonnées réelles absentes

Téléphone et email sont des placeholders (« Téléphone à renseigner », « Email à renseigner ») dans le footer et la page contact. Les vraies coordonnées connues (tél. 06 58 01 71 71, secteur Fréjus) doivent être renseignées dans le Studio — c'est l'information la plus recherchée par un prospect.

---

## 4. SEO — important

Pour une entreprise locale de TP, le référencement local est le principal levier d'acquisition. Plusieurs fondamentaux manquent :

- **Métadonnées par page absentes.** Seul `app/layout.tsx` définit un `title`/`description`. Toutes les autres pages (entreprise, activités, réalisations, contact, fiches activité/chantier) héritent du même titre → mauvais pour le référencement. Ajouter un `export const metadata` (ou `generateMetadata`) propre à chaque page, avec titres orientés requêtes locales (« Terrassement à Fréjus | FRTP », etc.).
- **Pas de `sitemap.xml` ni `robots.txt`.** Ajouter `app/sitemap.ts` et `app/robots.ts` (Next les génère nativement).
- **Pas de données structurées.** Ajouter un JSON-LD `LocalBusiness` / `GeneralContractor` (nom, adresse, téléphone, zone desservie, horaires, note) — déterminant pour le pack local Google.
- **Pas d'Open Graph / Twitter Card ni de `metadataBase`.** Les partages sur réseaux/messageries n'auront ni image ni description. Ajouter une image OG par défaut.
- **Pas de favicon / icônes** (`app/icon.png`, `apple-icon`).
- **`force-dynamic` sur toutes les pages.** Chaque page est recalculée à chaque visite : aucun cache, pages plus lentes (pénalité SEO indirecte via Core Web Vitals). Préférer du statique avec revalidation (ISR : `export const revalidate = 600`) et `revalidatePath` après modification dans le Studio.

---

## 5. Performance — important

- **Optimisation d'images désactivée.** `next.config.mjs` force `images: { unoptimized: true }`. Couplé à des images lourdes, cela alourdit fortement les pages :
  - `les-chenes.jpg` : 1,2 Mo · `horizon-hero.jpeg` : 828 Ko · `park-sainte-estelle.jpg` : 656 Ko · `bastide-jessica.jpeg` : 452 Ko
  - logos PNG : `frtp-logo.png` 580 Ko, `frtp-logo-white.png` 560 Ko (très lourd pour un logo).
- Actions : réactiver l'optimisation Next (`next/image` en WebP/AVIF), ou pré-compresser les visuels (< 200 Ko pour les photos, logo en SVG ou PNG < 30 Ko). Le hébergement Vercel prévu gère l'optimisation nativement.
- `force-dynamic` partout pénalise aussi le temps de réponse (voir §4).

---

## 6. Qualité éditoriale et accessibilité

- **Accents français supprimés partout.** Tous les contenus (`lib/data.ts`, `lib/studio.ts`) sont écrits sans accents : « realisations », « activites », « amenagements », « Frejus », « Saint-Raphael ». C'est peu professionnel à l'affichage et défavorable au SEO (les requêtes accentuées et le rendu typographique). Rétablir les accents (« réalisations », « activités », « Fréjus »…).
- **Accessibilité** : globalement correcte (libellés de formulaire présents, `lang="fr"`, `aria-label` sur les étoiles d'avis). À améliorer : message de statut du formulaire en `aria-live` (annonce aux lecteurs d'écran), vérifier le contraste de certains textes clairs sur fond clair, attribut `alt` plus descriptif sur les photos de chantier, et ajout d'un `<h1>` unique cohérent par page.

---

## 7. Robustesse technique (mineur)

- `SMTP_PASSWORD` est vide dans `.env.local` : les emails de notification de contact ne partiront pas tant qu'il n'est pas renseigné (la demande est tout de même enregistrée en base).
- `tsconfig.json` cible `es5`, daté pour Next 16 / React 19 — passer à `es2020`+ allège le code généré.
- Le bucket de stockage est (re)créé à chaque enregistrement du Studio (`createBucket` dans la route) : sans gravité mais à déplacer dans le script d'initialisation.
- Bonne pratique déjà en place : les fichiers de secours (`lib/data.ts`) permettent au site de fonctionner même si Supabase est indisponible — à conserver.

---

## 8. Plan d'action recommandé

Avant mise en ligne (bloquant) :
1. Révoquer/régénérer la clé service role Supabase ; retirer les secrets du dossier.
2. Désactiver les inscriptions Supabase et/ou ajouter un rôle admin (RLS + route API).
3. Compléter les mentions légales (SIREN, RCS, TVA, hébergeur, directeur de publication).
4. Compléter la politique de confidentialité RGPD + consentement sur le formulaire.
5. Remplacer les faux avis par de vrais avis (ou masquer la section).
6. Renseigner téléphone et email réels.

Avant/juste après le lancement (important) :
7. Métadonnées par page + sitemap + robots + JSON-LD LocalBusiness + OG/favicon.
8. Réactiver l'optimisation d'images et compresser les visuels et le logo.
9. Passer en statique + ISR au lieu de `force-dynamic`.
10. Rétablir les accents dans tous les contenus.

Améliorations :
11. Anti-spam du formulaire (honeypot/captcha, rate limit, validation, limites de taille).
12. Configurer le SMTP (mot de passe) et tester l'envoi.
13. Affinages d'accessibilité (`aria-live`, contrastes, alt).
