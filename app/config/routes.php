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
            'handler' => fn () => new App\Http\Handlers\Interactions\ShowHandler(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                new Domain\Input\QueryValidation(
                    $container->get(PDO::class),
                ),
                new Domain\ReadModel\InteractionViewSql(
                    $container->get(PDO::class),
                ),
            ),
        ],
    ];
};
