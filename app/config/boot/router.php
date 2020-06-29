<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;

/**
 * Populate the router.
 *
 * @param Psr\Container\ContainerInterface $container
 * @return void
 */
return function (ContainerInterface $container) {
    $factory = $container->get(Psr\Http\Message\ResponseFactoryInterface::class);
    $collector = $container->get(FastRoute\RouteCollector::class);

    $responder = new Quanta\Http\Responder($factory);

    $parse = function ($endpoint) use ($responder): \Psr\Http\Server\RequestHandlerInterface {
        [$endpoint, $middleware] = is_array($endpoint)
            ? [array_pop($endpoint), $endpoint]
            : [$endpoint, []];

        $handler = new Quanta\Http\Endpoint($responder, $endpoint, 'data', [
            'code' => 200,
            'success' => true,
        ]);

        return count($middleware) > 0
            ? Quanta\Http\RequestHandler::Queue($handler, ...$middleware)
            : $handler;
    };

    $routes = (require __DIR__ . '/../routes.php')($container);

    foreach ($routes as $route => $endpoint) {
        $parts = (array) preg_split('/\s+/', $route);

        if (count($parts) != 2) {
            throw new LogicException(
                sprintf('invalid endpoint \'%s\'', $route)
            );
        }

        $method = (string) array_shift($parts);
        $path = (string) array_shift($parts);
        $handler = $parse($endpoint);

        $collector->addRoute($method, $path, $handler);
    }
};
