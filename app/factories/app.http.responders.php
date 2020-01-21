<?php

declare(strict_types=1);

use App\Http\Responders\JsonResponder;

return [
    JsonResponder::class => fn ($container) => new JsonResponder(
        $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
    ),
];
