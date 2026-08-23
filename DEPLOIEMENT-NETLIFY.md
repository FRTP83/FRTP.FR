# Préparation du déploiement Netlify

Statut : configuration préparée localement. Aucun déploiement ni changement DNS ne doit être lancé avant validation.

## Projet source

- Dépôt GitHub : `FRTP83/FRTP.FR`
- Branche de production : `main`
- Répertoire de base : racine du dépôt
- Commande de compilation : `npm run build`
- Répertoire de publication : détection automatique Next.js par Netlify
- Version Node.js : 22

Netlify prend en charge Next.js avec son adaptateur OpenNext automatique. Aucun plugin Next.js ne doit être ajouté ou figé manuellement.

## Variables à créer dans Netlify

Variables publiques :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

Variables secrètes côté serveur :

- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `CONTACT_MAIL_TO`
- `CONTACT_MAIL_FROM`

Variables SMTP facultatives, uniquement comme solution de secours :

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`

Ne jamais copier `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` ou `SMTP_PASSWORD` dans une variable préfixée par `NEXT_PUBLIC_`.

## Procédure à exécuter après validation

1. Ouvrir le site Netlify déjà relié au dépôt GitHub.
2. Vérifier que la branche de production est `main`.
3. Ajouter les variables d'environnement sans les afficher dans les journaux.
4. Lancer un déploiement de prévisualisation.
5. Tester les pages publiques, l'administration, Supabase et le formulaire de contact.
6. Publier la version de production uniquement après validation de la prévisualisation.
7. Relier ensuite `frtp.fr` et `www.frtp.fr` depuis la zone DNS OVH.

## Vérifications avant publication

- La compilation `npm run build` doit réussir.
- Le formulaire doit créer une ligne dans `contact_requests`.
- La notification Resend doit arriver à `contact@frtp.fr`.
- Une personne non administratrice ne doit pas accéder au Studio.
- Les pages Mentions légales et Politique de confidentialité doivent mentionner Netlify.
- Aucun secret ne doit être présent dans GitHub ou dans le code généré côté navigateur.
- Aucun changement DNS ne doit être appliqué avant que l'URL de prévisualisation soit validée.
