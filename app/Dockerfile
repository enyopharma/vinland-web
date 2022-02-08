# Stage 1 - install php dependencies
FROM composer:2.0 as build-deps
WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-req=php
COPY . ./
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative

# Stage 2 - copy the artifacts and start php-fpm
FROM php:8.0.2-fpm
RUN apt-get update && \
    apt-get install -y libpq-dev && \
    rm -rf /var/lib/apt/lists/* && \
    docker-php-ext-install pdo_pgsql
COPY --from=build-deps /var/www/html ./
