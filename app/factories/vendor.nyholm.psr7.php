<?php

declare(strict_types=1);

use Psr\Http\Message\UriFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Nyholm\Psr7\Factory\Psr17Factory;

$factory = new Psr17Factory;

return [
    UriFactoryInterface::class => fn () => $factory,
    StreamFactoryInterface::class => fn () => $factory,
    ResponseFactoryInterface::class => fn () => $factory,
];
