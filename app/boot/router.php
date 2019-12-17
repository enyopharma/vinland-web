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
    $collector = $container->get(FastRoute\RouteCollector::class);

    $routes = (require __DIR__ . '/../routes.php')($container);

    foreach ($routes as $endpoint => $handler) {
        $parts = (array) preg_split('/\s+/', $endpoint);

        if (count($parts) != 2) {
            throw new LogicException(
                sprintf('invalid endpoint \'%s\'', $endpoint)
            );
        }

        if (! is_callable($handler)) {
            throw new LogicException(
                vsprintf('route handler must be a callable, %s given for endpoint \'%s\'', [
                    gettype($handler),
                    $endpoint,
                ])
            );
        }

        $method = (string) array_shift($parts);
        $path = (string) array_shift($parts);

        $collector->addRoute($method, $path, $handler);
    }
};
