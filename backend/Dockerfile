# Image de déploiement pour Coolify / VPS (Docker).
# Un seul conteneur : Apache avec mod_php, servant public/.
FROM php:8.2-apache

# --- Dépendances système + extensions PHP requises par Laravel -------------
# curl : utilisé par le HEALTHCHECK plus bas (et par les appels HTTP sortants).
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip curl ca-certificates \
        libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql mbstring zip bcmath opcache \
    && a2enmod rewrite remoteip \
    && rm -rf /var/lib/apt/lists/*

# --- Configuration Apache / PHP -------------------------------------------
# Le vhost sert public/ avec AllowOverride All : la config Debian par défaut
# est AllowOverride None, ce qui ignore silencieusement public/.htaccess et
# casse toutes les routes sauf la racine exacte.
COPY docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf
COPY docker/php-production.ini /usr/local/etc/php/conf.d/zz-production.ini

# Ne pas divulguer la version d'Apache/PHP dans les en-têtes de réponse.
RUN printf 'ServerTokens Prod\nServerSignature Off\nTraceEnable Off\n' \
        > /etc/apache2/conf-available/security-hardening.conf \
    && a2enconf security-hardening

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# --- Dépendances PHP ------------------------------------------------------
# Copiées d'abord et seules : tant que composer.lock ne change pas, Docker
# réutilise cette couche et ne retélécharge aucun paquet au redéploiement.
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev --no-scripts --no-autoloader \
        --prefer-dist --no-interaction --no-progress

# --- Code applicatif ------------------------------------------------------
COPY . .

# --no-scripts : la découverte des paquets (package:discover) a besoin d'une
# config applicative complète, qui n'existe qu'au runtime (variables Coolify).
# Laravel régénère bootstrap/cache au démarrage, l'entrypoint s'en charge.
RUN composer dump-autoload --optimize --no-dev --no-scripts --no-interaction \
    && rm -f /usr/bin/composer \
    && mkdir -p storage/framework/cache/data storage/framework/sessions \
               storage/framework/views storage/logs storage/app/public \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Route santé fournie par Laravel (bootstrap/app.php : health: '/up').
# Coolify s'appuie dessus pour valider un déploiement avant de basculer.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -fsS http://127.0.0.1/up || exit 1

EXPOSE 80
ENTRYPOINT ["entrypoint.sh"]
CMD ["apache2-foreground"]
