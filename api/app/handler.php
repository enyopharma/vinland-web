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
     * Get the app debug state.
     */
    $debug = $container->get('app.debug');

    /**
     * Get the response factory from the container.
     */
    $factory = $container->get(Psr\Http\Message\ResponseFactoryInterface::class);

    /**
     * Get the fast route dispatcher and build a router.
     */
    $router = new App\FastRouteRouter(
        $container->get(FastRoute\Dispatcher::class)
    );

    /**
     * Return the application request handler as a middleware queue.
     */
    return Quanta\Http\Dispatcher::queue(
        /**
         * Produce a response when an exception is thrown exception.
         */
        new App\Middleware\ServerErrorMiddleware($factory, $debug),

        /**
         * Add a json body to a not found response.
         */
        new App\Middleware\NotFoundJsonBodyMiddleware,

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
