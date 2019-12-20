<?php

declare(strict_types=1);

use Quanta\Http\RouterInterface;

return [
    RouterInterface::class => fn ($container) => new App\Http\Middleware\FastRouteRouter(
        new FastRoute\Dispatcher\GroupCountBased(
            $container->get(FastRoute\RouteCollector::class)->getData(),
        ),
    ),
];
