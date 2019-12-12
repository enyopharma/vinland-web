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
    $factory = $container->get(Psr\Http\Message\ResponseFactoryInterface::class);

    return [
        /**
         * Cross-origin resource sharing middleware.
         */
        new App\Http\Middleware\CORSMiddleware($factory, ['GET', 'POST'], ...explode(',', $_ENV['ALLOWED_DOMAINS'])),

        /**
         * Parse json body.
         */
        new Middlewares\JsonPayload,

        /**
         * Router.
         */
        new Zend\Expressive\Router\Middleware\RouteMiddleware(
            $container->get(Zend\Expressive\Router\RouterInterface::class)
        ),

        /**
         * Route dispatcher.
         */
        new Zend\Expressive\Router\Middleware\DispatchMiddleware,
    ];
};
