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
        'GET /annotations' => new App\Http\Handlers\Annotations\IndexHandler(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            $container->get(Domain\ReadModel\AnnotationViewInterface::class),
        ),

        'GET /taxa' => new App\Http\Handlers\Taxa\IndexHandler(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            $container->get(Domain\ReadModel\TaxonViewInterface::class),
        ),

        'GET /taxa/{ncbi_taxon_id:\d+}' => new App\Http\Handlers\Taxa\ShowHandler(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            $container->get(Domain\ReadModel\TaxonViewInterface::class),
        ),

        'POST /interactions' => new App\Http\Handlers\Interactions\IndexHandler(
            $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
            $container->get(Domain\ReadModel\InteractionViewInterface::class),
            new App\Http\Validations\RequestToQuery($container->get(PDO::class)),
        ),
    ];
};
