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
        'GET /proteins' => new App\Endpoints\Proteins\IndexEndpoint(
            $container->get(App\ReadModel\ProteinViewInterface::class),
        ),

        'GET /proteins/{protein_id:\d+}' => new App\Endpoints\Proteins\ShowEndpoint(
            $container->get(App\ReadModel\ProteinViewInterface::class),
        ),

        'GET /proteins/{protein_id:\d+}/isoforms/{isoform_id:\d+}' => new App\Endpoints\Proteins\Isoforms\ShowEndpoint(
            $container->get(App\ReadModel\IsoformViewInterface::class),
        ),

        'GET /annotations' => new App\Endpoints\Annotations\IndexEndpoint(
            $container->get(App\ReadModel\AnnotationViewInterface::class),
        ),

        'GET /taxa' => new App\Endpoints\Taxa\IndexEndpoint(
            $container->get(App\ReadModel\TaxonViewInterface::class),
        ),

        'GET /taxa/{ncbi_taxon_id:\d+}/related' => new App\Endpoints\Taxa\Related\IndexEndpoint(
            $container->get(App\ReadModel\TaxonViewInterface::class),
        ),

        'GET /taxa/{ncbi_taxon_id:\d+}/names' => new App\Endpoints\Taxa\Names\IndexEndpoint(
            $container->get(App\ReadModel\TaxonViewInterface::class),
        ),

        'POST /interactions' => [
            new Middlewares\JsonPayload,
            new App\Middleware\InputValidationMiddleware(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                [App\Request\QueryInput::class, 'from'],
            ),
            new App\Endpoints\Interactions\IndexEndpoint(
                $container->get(App\ReadModel\InteractionViewInterface::class),
            ),
        ],
    ];
};
