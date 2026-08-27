# Déploiement — Backend (Koyeb)

## Fichiers de déploiement

- `Procfile` — indique à Koyeb comment démarrer l'app (`web`) et exécuter les migrations à chaque déploiement (`release`).
- `.env.example` — liste complète des variables ; sert de référence pour configurer les variables d'environnement sur Koyeb.

## Variables d'environnement à configurer sur Koyeb

Dans le tableau de bord Koyeb, section "Environment variables" du service :

| Variable | Valeur en production |
|---|---|
| `APP_NAME` | `X-Pressing` |
| `APP_ENV` | `production` |
| `APP_KEY` | (généré une fois, à ne jamais changer après le premier déploiement) |
| `APP_DEBUG` | `false` |
| `APP_URL` | URL Koyeb du backend, ex. `https://x-pressing-api.koyeb.app` |
| `APP_LOCALE` | `fr` |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | host MySQL Aiven |
| `DB_PORT` | port MySQL Aiven |
| `DB_DATABASE` | nom de la base Aiven |
| `DB_USERNAME` | utilisateur Aiven |
| `DB_PASSWORD` | mot de passe Aiven |
| `SESSION_DRIVER` | `database` |
| `CACHE_STORE` | `database` |
| `QUEUE_CONNECTION` | `sync` |
| `FRONTEND_URL` | URL Vercel du frontend, ex. `https://x-pressing.vercel.app` |
| `FRONTEND_URLS` | même URL (utilisée pour la liste CORS) |
| `MAIL_MAILER` | `log` (aucun envoi réel tant qu'aucun fournisseur mail n'est configuré) |
| `KKIAPAY_PUBLIC_KEY` / `KKIAPAY_PRIVATE_KEY` / `KKIAPAY_SECRET` | clés sandbox actuelles |
| `KKIAPAY_SANDBOX` | `true` |

## Après le premier déploiement

Le seeder de démonstration (`DemoDataSeeder`) doit être exécuté une fois manuellement (le `Procfile` ne lance que les migrations, pas le seed, pour ne jamais écraser des données réelles par erreur) :

```bash
php artisan db:seed --class=DemoDataSeeder --force
```

À exécuter via la console/le terminal fourni par Koyeb pour le service, une fois celui-ci démarré.
