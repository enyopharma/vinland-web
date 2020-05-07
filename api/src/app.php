<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseFactoryInterface;

/**
 * Get the app debug state and env.
 */
$env = $_ENV['APP_ENV'];
$debug = $_ENV['APP_DEBUG'];

/**
 * Get the container.
 */
$container = (require __DIR__ . '/container.php')($env, $debug);

/**
 * Run the boot scripts.
 */
foreach ((array) glob(__DIR__ . '/../boot/*.php') as $boot) {
    (require $boot)($container);
}

/**
 * Get the response factory from the container.
 */
$factory = $container->get(Psr\Http\Message\ResponseFactoryInterface::class);

/**
 * Get the fast route dispatcher and build a router.
 */
$router = new App\Adapters\FastRouteRouter(
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
