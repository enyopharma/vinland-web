<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;

/**
 * Return the route definitions.
 *
 * @param Psr\Container\ContainerInterface $container
 * @return array[]
 */
return function (ContainerInterface $container): array {
    return [
        'GET /' => [
            'name' => 'index',
            'handler' => fn () => new App\Http\Handlers\IndexHandler(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                $container->get(League\Plates\Engine::class),
            ),
        ],

        'POST /interactions' => [
            'handler' => fn () => new App\Http\Handlers\Interactions\IndexHandler(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                $container->get(Domain\ReadModel\InteractionViewInterface::class),
                new App\Http\Validations\RequestToQuery($container->get(PDO::class))
            ),
        ],

        'GET /taxa' => [
            'handler' => fn () => new App\Http\Handlers\Taxa\IndexHandler(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                $container->get(Domain\ReadModel\TaxaViewInterface::class),
            ),
        ],

        'GET /annotations' => [
            'handler' => fn () => new App\Http\Handlers\Annotations\IndexHandler(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                $container->get(Domain\ReadModel\AnnotationViewInterface::class),
            ),
        ],
    ];
};
