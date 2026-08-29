#!/bin/sh
# Point d'entrée du conteneur : prépare l'application puis lance Apache.
# Tout ce qui dépend de la configuration réelle (base de données, URL, clés)
# se fait ici et non au build, puisque les variables ne sont injectées par
# Coolify qu'au démarrage du conteneur.
set -e

log() { echo "[entrypoint] $*"; }

# --- Garde-fou : sans APP_KEY, Laravel échoue sur toute donnée chiffrée ----
# On préfère un message explicite maintenant qu'une 500 opaque en production.
# NE JAMAIS générer la clé automatiquement : elle changerait à chaque
# redéploiement et invaliderait toutes les données chiffrées existantes.
if [ -z "$APP_KEY" ] && ! grep -qs '^APP_KEY=base64:' .env; then
    log "ERREUR : APP_KEY n'est pas définie."
    log "Générez-la une fois avec 'php artisan key:generate --show' et"
    log "collez la valeur dans les variables d'environnement Coolify."
    exit 1
fi

# --- Dossiers de travail --------------------------------------------------
# Un volume fraîchement créé est vide et appartient à root : on recrée
# l'arborescence attendue et on rend la main à www-data.
mkdir -p storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs \
         storage/app/public \
         bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# --- Attente de la base de données ---------------------------------------
# Au premier démarrage de la stack, MySQL peut ne pas encore accepter les
# connexions. On patiente au lieu de planter le conteneur en boucle.
if [ "${WAIT_FOR_DB:-true}" = "true" ]; then
    tries=0
    until php artisan db:show >/dev/null 2>&1; do
        tries=$((tries + 1))
        if [ "$tries" -ge 30 ]; then
            log "Base de données toujours injoignable après 60s, on continue"
            log "quand même : la commande suivante affichera l'erreur exacte."
            break
        fi
        log "En attente de la base de données... ($tries/30)"
        sleep 2
    done
fi

# --- Migrations -----------------------------------------------------------
# Mettre RUN_MIGRATIONS=false pour un déploiement où la base ne doit pas
# bouger (rollback applicatif, montée de version en deux temps...).
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    log "Exécution des migrations"
    php artisan migrate --force
fi

# --- Seed de démonstration (ponctuel, jamais automatique) -----------------
# À activer manuellement dans Coolify (SEED_DEMO_DATA=true), le temps d'un
# redémarrage, puis à repasser à false : ce seeder écrase des données.
if [ "${SEED_DEMO_DATA:-false}" = "true" ]; then
    log "Exécution de DemoDataSeeder"
    php artisan db:seed --class=DemoDataSeeder --force
fi

# --- Lien symbolique storage ---------------------------------------------
php artisan storage:link --force >/dev/null 2>&1 || true

# --- Caches de production -------------------------------------------------
# clear avant cache : un cache hérité de l'image ou d'un précédent démarrage
# contiendrait les anciennes variables d'environnement. On ne vide que les
# caches de fichiers, jamais le cache applicatif (store `database`) : sa
# table peut ne pas exister encore, et son contenu n'a pas à disparaître
# à chaque déploiement.
log "Reconstruction des caches"
php artisan config:clear >/dev/null
php artisan route:clear >/dev/null
php artisan view:clear >/dev/null
php artisan event:clear >/dev/null
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

chown -R www-data:www-data bootstrap/cache storage/framework

log "Démarrage : $*"
exec "$@"
