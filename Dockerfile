# Stage 1 - install php dependencies
FROM composer:1.9 as build-deps
WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-suggest --no-interaction --prefer-dist --optimize-autoloader
COPY . ./
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative

# Stage 2 - copy the artifacts and start php-fpm
FROM php:7.4-fpm
RUN apt-get update && \
    apt-get install -y libpq-dev && \
    rm -rf /var/lib/apt/lists/* && \
    docker-php-ext-install pdo_pgsql
COPY --from=build-deps /var/www/html ./
