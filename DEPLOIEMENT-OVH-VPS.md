# Deploiement OVH VPS - FRTP

Objectif : heberger le site FRTP sur un VPS OVH avec Node.js, sans Netlify.

## Architecture retenue

- Domaine : OVH, zone DNS de `frtp.fr`
- Serveur : OVH VPS Ubuntu
- Runtime : Node.js LTS
- Process manager : PM2
- Reverse proxy : Nginx
- HTTPS : Certbot / Let's Encrypt
- Donnees modifiables : Supabase
- Images : Supabase Storage, avec compression recommandee avant upload

## 1. Preparer le VPS

Sur le VPS OVH, installer les paquets de base :

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y nginx git curl ufw
```

Installer Node.js LTS :

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Installer PM2 :

```bash
sudo npm install -g pm2
```

## 2. Recuperer le site

Creer le dossier applicatif :

```bash
sudo mkdir -p /var/www/frtp
sudo chown -R $USER:$USER /var/www/frtp
cd /var/www/frtp
```

Envoyer les fichiers du projet dans ce dossier, soit par Git, soit par SFTP.

Important : ne pas envoyer `node_modules`, `.next`, ni `.env.local` depuis Windows.

## 3. Configurer l'environnement

Creer le fichier `.env.local` sur le VPS :

```bash
nano .env.local
```

Reprendre les valeurs de `.env.example`, puis renseigner les cles Supabase et SMTP :

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://www.frtp.fr
CONTACT_MAIL_TO=contact@frtp.fr
CONTACT_MAIL_FROM=contact@frtp.fr
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@frtp.fr
SMTP_PASSWORD=
```

Ne jamais publier ce fichier.

## 4. Installer et compiler

```bash
npm ci
npm run build
```

Tester localement sur le VPS :

```bash
npm run start
```

Puis couper avec `Ctrl+C`.

## 5. Lancer avec PM2

Depuis `/var/www/frtp` :

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

La commande `pm2 startup` affiche une commande `sudo ...` a copier/coller pour que le site redemarre automatiquement apres reboot.

Commandes utiles :

```bash
pm2 status
pm2 logs frtp-site
pm2 restart frtp-site
```

## 6. Configurer Nginx

Creer le fichier :

```bash
sudo nano /etc/nginx/sites-available/frtp.fr
```

Contenu :

```nginx
server {
    listen 80;
    server_name frtp.fr www.frtp.fr;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activer le site :

```bash
sudo ln -s /etc/nginx/sites-available/frtp.fr /etc/nginx/sites-enabled/frtp.fr
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Pointer OVH vers le VPS

Dans la zone DNS OVH de `frtp.fr` :

- `A` pour `frtp.fr` vers l'IPv4 du VPS
- `A` pour `www.frtp.fr` vers l'IPv4 du VPS

Optionnel si IPv6 active :

- `AAAA` pour `frtp.fr` vers l'IPv6 du VPS
- `AAAA` pour `www.frtp.fr` vers l'IPv6 du VPS

Attendre la propagation DNS.

## 8. Activer HTTPS

Installer Certbot :

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Lancer :

```bash
sudo certbot --nginx -d frtp.fr -d www.frtp.fr
```

Verifier le renouvellement :

```bash
sudo certbot renew --dry-run
```

## 9. Pare-feu minimal

```bash
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
sudo ufw status
```

## 10. Mise a jour du site

Apres modification du code :

```bash
cd /var/www/frtp
npm ci
npm run build
pm2 restart frtp-site
```

## Points de vigilance

- Ne pas exposer le port `3000` publiquement : Nginx doit servir le site.
- Garder `.env.local` uniquement sur le serveur.
- Surveiller l'espace disque si beaucoup de photos sont ajoutees.
- Compresser les images avant envoi depuis le Studio pour eviter de remplir Supabase trop vite.
- Sauvegarder regulierement Supabase et les variables `.env.local`.
