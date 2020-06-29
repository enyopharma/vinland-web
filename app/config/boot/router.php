<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;

/**
 * Populate the router.
 *
 * @param Psr\Container\ContainerInterface $container
 * @return void
 */
return function (ContainerInterface $container): void {
    $collector = $container->get(FastRoute\RouteCollector::class);

    $routes = (require __DIR__ . '/../routes.php')($container);

    foreach ($routes as $route => $handler) {
        $parts = (array) preg_split('/\s+/', $route);

        if (count($parts) != 2) {
            throw new LogicException(
                sprintf('invalid endpoint \'%s\'', $route)
            );
        }

        $method = (string) array_shift($parts);
        $path = (string) array_shift($parts);

        $collector->addRoute($method, $path, $handler);
    }
};
