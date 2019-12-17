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
    return [
        /**
         * Cross-origin resource sharing middleware.
         */
        new App\Http\Middleware\CORSMiddleware(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            ['GET', 'POST'],
            ...explode(',', $_ENV['ALLOWED_DOMAINS'])
        ),

        /**
         * Parse json body.
         */
        new Middlewares\JsonPayload,

        /**
         * Router.
         */
        new App\Http\Middleware\FastRouteMiddleware(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            $container->get(FastRoute\Dispatcher::class)
        ),
    ];
};
