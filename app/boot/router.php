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
    $collector = new Zend\Expressive\Router\RouteCollector(
        $container->get(Zend\Expressive\Router\RouterInterface::class)
    );

    $routes = (require __DIR__ . '/../routes.php')($container);

    foreach ($routes as $endpoint => $route) {
        $parts = (array) preg_split('/\s+/', $endpoint);

        if (count($parts) != 2) {
            throw new LogicException(
                sprintf('invalid endpoint \'%s\'', $endpoint)
            );
        }

        if (! key_exists('handler', $route)) {
            throw new LogicException(
                sprintf('missing handler for endpoint \'%s\'', $endpoint)
            );
        }

        if (! is_callable($route['handler'])) {
            throw new LogicException(
                vsprintf('route handler must be a callable, %s given for endpoint %s', [
                    gettype($route['handler']),
                    $endpoint,
                ])
            );
        }

        $method = (string) array_shift($parts);
        $path = (string) array_shift($parts);
        $name = $route['name'] ?? null;
        $handler = $route['handler'];

        $middleware = new App\Http\Middleware\RequestHandlerMiddleware(
            new App\Http\Handlers\LazyRequestHandler(
                $handler
            )
        );

        $collector->route($path, $middleware, [$method], $name);
    }
};
