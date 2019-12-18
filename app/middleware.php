<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;

/**
 * Return an array of middleware.
 *
 * @param Psr\Container\ContainerInterface $container
 * @return Psr\Http\Server\MiddlewareInterface[]
 */
return function (ContainerInterface $container): array {
    /**
     * CORS settings.
     */
    $settings = (new Neomerx\Cors\Strategies\Settings)
        ->init('http', $_ENV['APP_HOST'], 80)
        ->setAllowedOrigins(explode(',', $_ENV['ALLOWED_ORIGINS']))
        ->setAllowedMethods(['GET', 'POST'])
        ->setAllowedHeaders(['content-type']);

    return [
        /**
         * Cross-origin resource sharing middleware.
         */
        new Middlewares\Cors(
            Neomerx\Cors\Analyzer::instance($settings),
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
        ),

        /**
         * Router.
         */
        new App\Http\Middleware\FastRouteMiddleware(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            $container->get(FastRoute\Dispatcher::class),
        ),

        /**
         * Parse json body.
         */
        new Middlewares\JsonPayload,

        /**
         * Execute the matched request handler.
         */
        new App\Http\Middleware\RequestHandlerMiddleware,
    ];
};
