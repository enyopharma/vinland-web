<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseFactoryInterface;

/**
 * A factory producing the application request handler.
 *
 * @param Psr\Container\ContainerInterface $container
 * @return Psr\Http\Server\RequestHandlerInterface
 */
return function (ContainerInterface $container): RequestHandlerInterface {
    /**
     * Get the configured CORS analyzer.
     */
    $cors = (require __DIR__ . '/config/cors.analyzer.php')($container);

    /**
     * Get the response factory from the container.
     */
    $factory = $container->get(Psr\Http\Message\ResponseFactoryInterface::class);

    /**
     * Get the fast route dispatcher from the container.
     */
    $router = $container->get(Quanta\Http\RouterInterface::class);

    /**
     * Return the application request handler as a middleware queue.
     */
    return Quanta\Http\Dispatcher::queue(
        /**
         * Cross-origin resource sharing middleware.
         */
        new Middlewares\Cors($cors, $factory),

        /**
         * Router.
         */
        new Quanta\Http\RoutingMiddleware($factory, $router),

        /**
         * Parse json body.
         */
        new Middlewares\JsonPayload,

        /**
         * Execute the matched request handler.
         */
        new Quanta\Http\MatchedRouteMiddleware,
    );
};
