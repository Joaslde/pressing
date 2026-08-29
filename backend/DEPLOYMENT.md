# Déploiement — Backend X-Pressing (Coolify / VPS, Docker)

L'API est packagée en une image Docker unique : Apache + PHP 8.2 servant
`public/`. Le build se fait **sur le VPS** (Coolify clone le dépôt et
construit l'image là-bas) : rien de lourd à télécharger depuis le poste de
développement.

## Fichiers concernés

| Fichier | Rôle |
|---|---|
| `Dockerfile` | Image de production : extensions PHP, dépendances Composer, OPcache, healthcheck. |
| `.dockerignore` | Exclut `vendor/`, `.env`, `tests/`… du contexte de build. |
| `docker/apache-vhost.conf` | Vhost servant `public/`, logs vers stdout, vraie IP client derrière le proxy. |
| `docker/php-production.ini` | Réglages PHP de production (erreurs masquées, OPcache, limites). |
| `docker/entrypoint.sh` | Au démarrage : permissions, attente de la base, migrations, caches. |
| `docker-compose.yml` | Stack app + MySQL (+ worker de queue optionnel). |
| `.env.coolify.example` | Liste complète des variables à renseigner dans Coolify. |

## Option A — Application « Docker Compose » (app + MySQL ensemble)

La plus simple : Coolify gère l'API et sa base comme une seule ressource.

1. Dans Coolify : **+ New** → **Resource** → **Application** → source Git
   (le dépôt du projet).
2. **Build Pack** : `Docker Compose`.
3. **Base Directory** : `/backend` (le `docker-compose.yml` y vit, pas à la
   racine du dépôt).
4. **Docker Compose Location** : `/backend/docker-compose.yml`.
5. **Environment Variables** : coller le contenu de `.env.coolify.example`
   et remplir les valeurs (voir « Variables » plus bas).
6. **Domains** : associer le domaine public au service `app`, port `80`.
   Coolify émet le certificat TLS et fait le reverse proxy ; le conteneur
   n'expose rien directement sur l'hôte.
7. **Deploy**.

## Option B — Application « Dockerfile » + base gérée par Coolify

À préférer si la base doit être sauvegardée/administrée par Coolify, ou si
elle reste chez un hébergeur externe (Aiven…).

1. Créer d'abord la base : **+ New** → **Database** → **MySQL**. Noter le
   hostname interne, la base, l'utilisateur et le mot de passe.
2. **+ New** → **Application** → source Git, **Build Pack** : `Dockerfile`.
3. **Base Directory** : `/backend`. **Ports Exposes** : `80`.
4. Variables d'environnement : idem, avec `DB_HOST` = hostname interne de la
   base Coolify (et non `mysql`).
5. Attacher l'application et la base au même réseau/projet Coolify pour
   qu'elles se voient.

Pour une base distante en TLS (Aiven), ajouter :
`MYSQL_ATTR_SSL_CA=/var/www/html/storage/certs/aiven-ca.pem` (le certificat
est versionné dans le dépôt).

## Variables d'environnement

Référence complète et commentée : **`.env.coolify.example`**. Les points
qui font échouer un déploiement quand ils sont oubliés :

- **`APP_KEY`** — obligatoire, générée une seule fois, jamais modifiée
  ensuite (elle chiffre les données stockées). Sans elle, le conteneur
  s'arrête au démarrage avec un message explicite.
  ```bash
  docker run --rm php:8.2-cli php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
  ```
- **`APP_URL`** — le domaine public en `https://`.
- **`FRONTEND_URLS`** — liste des origines autorisées par CORS, séparées par
  des virgules. Sans l'URL exacte du frontend, le navigateur bloque tous les
  appels à l'API.
- **`DB_PASSWORD`** / **`DB_ROOT_PASSWORD`** — obligatoires avec l'option A.
- `APP_DEBUG` reste à `false` : sinon les traces d'erreur, avec la
  configuration et des fragments de requêtes SQL, partent au client.

## Ce qui se passe à chaque déploiement

`docker/entrypoint.sh`, avant de lancer Apache :

1. refuse de démarrer si `APP_KEY` est absente ;
2. recrée l'arborescence `storage/` et ses permissions (un volume neuf est
   vide et appartient à `root`) ;
3. attend que la base réponde (jusqu'à 60 s) ;
4. joue `php artisan migrate --force` — désactivable avec
   `RUN_MIGRATIONS=false` ;
5. reconstruit les caches config / routes / vues / événements.

Le healthcheck du conteneur interroge `/up` (route santé déclarée dans
`bootstrap/app.php`) : Coolify attend qu'il passe au vert avant de router le
trafic vers la nouvelle version.

## Jeu de données de démonstration

`DemoDataSeeder` n'est jamais exécuté automatiquement — il écrase des
données. Pour le lancer une fois :

- mettre `SEED_DEMO_DATA=true` dans Coolify, redémarrer, puis **remettre
  `false`** ;
- ou, depuis le terminal Coolify du conteneur :
  ```bash
  php artisan db:seed --class=DemoDataSeeder --force
  ```

## File d'attente (optionnel)

`QUEUE_CONNECTION=sync` par défaut : les notifications partent dans la
requête HTTP, aucun worker nécessaire. Pour les traiter en arrière-plan :
passer `QUEUE_CONNECTION=database` et activer le profil Compose `queue`
(service `queue` du `docker-compose.yml`).

## Vérifications après déploiement

```bash
curl -i https://api.exemple.com/up     # 200 -> app et base OK
curl -s https://api.exemple.com/       # {"name":"X-Pressing","status":"ok"}
```

Puis, côté frontend, vérifier qu'un appel API ne renvoie pas d'erreur CORS
(sinon : `FRONTEND_URLS` ne contient pas l'origine exacte, schéma et
sous-domaine compris).

---

*Note : `Procfile` est un vestige du déploiement Koyeb (buildpack PHP) et
n'est pas utilisé par Docker/Coolify.*
