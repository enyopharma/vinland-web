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
        'POST /interactions' => fn () => new App\Http\Handlers\Interactions\IndexHandler(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            $container->get(Domain\ReadModel\InteractionViewInterface::class),
            new App\Http\Validations\RequestToQuery($container->get(PDO::class))
        ),

        'GET /taxa' => fn () => new App\Http\Handlers\Taxa\IndexHandler(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            $container->get(Domain\ReadModel\TaxaViewInterface::class),
        ),

        'GET /taxa/{left}/{right}/names' => fn () => new App\Http\Handlers\Taxa\Names\IndexHandler(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            $container->get(Domain\ReadModel\TaxonNamesViewInterface::class),
            new App\Http\Validations\RequestToTaxon($container->get(PDO::class))
        ),

        'GET /annotations' => fn () => new App\Http\Handlers\Annotations\IndexHandler(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            $container->get(Domain\ReadModel\AnnotationViewInterface::class),
        ),
    ];
};
