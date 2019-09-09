<?php

declare(strict_types=1);

use Zend\Expressive\Helper\UrlHelper;

return [
    UrlHelper::class => fn ($c) => new UrlHelper(
        $c->get(Zend\Expressive\Router\RouterInterface::class)
    ),
];
