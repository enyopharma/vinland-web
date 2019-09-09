<?php

declare(strict_types=1);

use Zend\Expressive\Router\RouterInterface;

return [
    RouterInterface::class => fn () => new Zend\Expressive\Router\FastRouteRouter,
];
