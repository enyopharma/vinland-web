<?php

declare(strict_types=1);

use FastRoute\Dispatcher;
use FastRoute\RouteCollector;

return [
    RouteCollector::class => fn () => new RouteCollector(
        new FastRoute\RouteParser\Std,
        new FastRoute\DataGenerator\GroupCountBased,
    ),

    Dispatcher::class => fn ($c) => new FastRoute\Dispatcher\GroupCountBased(
        $c->get(FastRoute\RouteCollector::class)->getData(),
    ),
];
