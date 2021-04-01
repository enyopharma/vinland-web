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

    $files = glob(__DIR__ . '/../routes/*.php');

    foreach ($files as $file) {
        $f = require $file;

        if (!is_callable($f)) {
            throw new UnexpectedValueException(
                sprintf('Value returned by file \'%s\' must be a callable, %s returned', $file, gettype($f)),
            );
        }

        $routes = $f($container);

        if (!is_iterable($routes)) {
            throw new UnexpectedValueException(
                vsprintf('Value returned the route definition callable from file \'%s\' must be an array, %s returned', [
                    $file,
                    gettype($f),
                ]),
            );
        }

        foreach ($routes as $route) {
            if (!$route instanceof Quanta\Http\Route) {
                throw new UnexpectedValueException('iterable returned by the route definition callable must contain only Route instances');
            }

            $methods = $route->methods();
            $pattern = $route->pattern();
            $handler = $route->handler();

            $collector->addRoute($methods, $pattern, $handler);
        }
    }
};
