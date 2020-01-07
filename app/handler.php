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
     * Get the fast route dispatcher and build a router.
     */
    $router = new App\Http\FastRouteRouter(
        $container->get(FastRoute\Dispatcher::class)
    );

    /**
     * Return the application request handler as a middleware queue.
     */
    return Quanta\Http\Dispatcher::queue(
        /**
         * Cross-origin resource sharing middleware.
         */
        new Middlewares\Cors($cors, $factory),

        /**
         * Parse json body.
         */
        new Middlewares\JsonPayload,

        /**
         * Router.
         */
        new Quanta\Http\RoutingMiddleware($router),

        /**
         * Return a not allowed response.
         */
        new Quanta\Http\NotAllowedMiddleware($factory),

        /**
         * Return a not found response.
         */
        new Quanta\Http\NotFoundMiddleware($factory),
    );
};
