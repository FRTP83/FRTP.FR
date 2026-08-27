# Audit local FRTP

Date : 27 août 2026  
Périmètre : version locale uniquement, sans publication ni modification des services externes.

## Résultat

- Build Next.js : validé, 34 pages générées.
- ESLint : validé.
- Dépendances de production : aucune vulnérabilité connue (`npm audit --omit=dev`).
- Liens internes : 24 pages explorées, aucun lien cassé.
- Sitemap : 21 URL contrôlées, toutes répondent en HTTP 200.
- Page 404 : répond correctement en HTTP 404.
- Console navigateur : aucune erreur ni alerte.
- Lighthouse local, mobile : accessibilité 100, bonnes pratiques 100, SEO 100.
- Performance Lighthouse locale : 78. La principale limite est l'image de couverture distante chargée depuis Supabase ; sa découverte prioritaire est maintenant correctement configurée.

## Corrections appliquées localement

### Référencement

- Métadonnées locales renforcées sur les pages d'activités.
- Données structurées JSON-LD pour l'entreprise, les services, les réalisations, les actualités et les fils d'Ariane.
- Contrôle des URL canoniques, du sitemap, de `robots.txt`, du manifeste et des aperçus sociaux.
- Textes publics provisoires ou réservés à l'administration remplacés dans les valeurs locales par défaut.

### Accessibilité et interface

- Contraste du principal orange de marque corrigé pour le texte blanc.
- Étoiles de notation rendues valides dans l'arbre d'accessibilité.
- Champs obligatoires du formulaire clairement signalés.
- Validation native du formulaire contrôlée : le premier champ invalide reçoit correctement le focus.
- Menu mobile contrôlé : ouverture, libellé, état développé et fermeture avec Échap.
- Affichages ordinateur et mobile contrôlés par captures réelles.

### Fonctionnel et sécurité

- Validation côté serveur des champs, longueurs, email et type de travaux.
- Rejet des requêtes de formulaire provenant d'une origine étrangère.
- Limitation du volume, piège antispam et limitation de débit déjà présents et conservés.
- Test local : formulaire vide rejeté en HTTP 400 ; origine étrangère rejetée en HTTP 403.
- En-têtes CSP, anti-framing, anti-MIME-sniffing, politique de référent et restrictions de permissions contrôlés.

### Protection des données

- Information de premier niveau complétée directement sous le formulaire : responsable, finalité, base juridique, durée de conservation, droits et adresse de contact.
- La politique détaillée reste accessible au même endroit.
- Aucun traceur marketing ni outil de mesure d'audience n'est intégré dans le code public audité ; aucun bandeau de consentement n'est donc ajouté artificiellement.

## Points nécessitant une validation humaine avant publication

1. Confirmer que toutes les photographies et tous les avis clients peuvent être publiés et que leurs droits d'utilisation sont documentés.
2. Confirmer les données juridiques : forme, capital, SIREN/SIRET, TVA, dirigeant et adresse.
3. Ajouter le numéro de téléphone officiel de l'hébergeur dans les mentions légales si celui actuellement retenu est confirmé par Netlify.
4. Confirmer si FRTP contracte avec des consommateurs. Si oui, identifier le médiateur de la consommation compétent et ajouter ses coordonnées.
5. Vérifier les contrats de sous-traitance et mécanismes de transfert de Supabase, Resend, Netlify et Google ; le code seul ne permet pas de valider ces documents.
6. Vérifier que l'adresse, le téléphone et les zones desservies sont strictement identiques sur le site, Google Business Profile et les annuaires professionnels.

## Références réglementaires consultées

- Ministère de l'Économie — mentions obligatoires d'un site professionnel : https://www.economie.gouv.fr/entreprises/developper-son-entreprise/innover-et-numeriser-son-entreprise/mentions-sur-votre-site-internet-les-obligations-respecter
- CNIL — exemples d'information sur un formulaire : https://www.cnil.fr/fr/exemples-de-formulaire-de-collecte-de-donnees-caractere-personnel
- CNIL — règles relatives aux cookies et traceurs : https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles

Ce document est un audit technique et de conformité de premier niveau, pas un avis juridique.
