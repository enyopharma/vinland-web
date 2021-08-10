<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Quanta\Http\Route;
use Quanta\Http\Endpoint;
use Quanta\Http\MetadataSerializer;

/**
 * Return the route definitions.
 *
 * @param Psr\Container\ContainerInterface $container
 * @return \Psr\Http\Server\RequestHandlerInterface[]
 */
return function (ContainerInterface $container): array {
    $factory = $container->get(ResponseFactoryInterface::class);

    $serializer = new MetadataSerializer('data', ['code' => 200, 'success' => true]);

    $endpoint = fn (callable $f) => new Endpoint($factory, $f, $serializer);

    return [
        Route::matching('/proteins')
            ->get($endpoint(new App\Endpoints\Proteins\IndexEndpoint(
                $container->get(App\ReadModel\ProteinViewInterface::class),
            ))),

        Route::matching('/proteins/{protein_id:\d+}')
            ->get($endpoint(new App\Endpoints\Proteins\ShowEndpoint(
                $container->get(App\ReadModel\ProteinViewInterface::class),
            ))),

        Route::matching('/proteins/{protein_id:\d+}/isoforms')
            ->get($endpoint(new App\Endpoints\Isoforms\IndexEndpoint(
                $container->get(App\ReadModel\ProteinViewInterface::class),
                $container->get(App\ReadModel\IsoformViewInterface::class),
            ))),

        Route::matching('/proteins/{protein_id:\d+}/isoforms/{isoform_id:\d+}')
            ->get($endpoint(new App\Endpoints\Isoforms\ShowEndpoint(
                $container->get(App\ReadModel\ProteinViewInterface::class),
                $container->get(App\ReadModel\IsoformViewInterface::class),
            ))),

        Route::matching('/proteins/{protein_id:\d+}/isoforms/{isoform_id:\d+}/features')
            ->get($endpoint(new App\Endpoints\Features\IndexEndpoint(
                $container->get(App\ReadModel\ProteinViewInterface::class),
                $container->get(App\ReadModel\IsoformViewInterface::class),
                $container->get(App\ReadModel\FeatureViewInterface::class),
            ))),

        Route::matching('/proteins/{protein_id:\d+}/mappings/targeting')
            ->get($endpoint(new App\Endpoints\Mappings\IndexEndpoint(
                $container->get(App\ReadModel\ProteinViewInterface::class),
                $container->get(App\ReadModel\MappingViewInterface::class),
            ))),

        Route::matching('/proteins/{protein_id:\d+}/interactors/{type:h|v}')
            ->get($endpoint(new App\Endpoints\Interactors\IndexEndpoint(
                $container->get(App\ReadModel\ProteinViewInterface::class),
                $container->get(App\ReadModel\InteractorViewInterface::class),
            ))),

        Route::matching('/interactions/{interaction_id:\d+}')
            ->get($endpoint(new App\Endpoints\Interactions\ShowEndpoint(
                $container->get(App\ReadModel\InteractionViewInterface::class),
            ))),

        Route::matching('/interactions/{interaction_id:\d+}/descriptions')
            ->get($endpoint(new App\Endpoints\Descriptions\IndexEndpoint(
                $container->get(App\ReadModel\InteractionViewInterface::class),
                $container->get(App\ReadModel\DescriptionViewInterface::class),
            ))),

        Route::matching('/annotations')
            ->get($endpoint(new App\Endpoints\Annotations\IndexEndpoint(
                $container->get(App\ReadModel\AnnotationViewInterface::class),
            ))),

        Route::matching('/taxa')
            ->get($endpoint(new App\Endpoints\Taxa\IndexEndpoint(
                $container->get(App\ReadModel\TaxonViewInterface::class),
            ))),

        Route::matching('/taxa/{ncbi_taxon_id:\d+}[/{option:related|names}]')
            ->get($endpoint(new App\Endpoints\Taxa\ShowEndpoint(
                $container->get(App\ReadModel\TaxonViewInterface::class),
            ))),

        Route::matching('/interactions')
            ->middleware(new App\Middleware\InputValidationMiddleware(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                App\Input\InteractionQueryInput::factory(),
            ))
            ->post($endpoint(new App\Endpoints\Interactions\IndexEndpoint(
                $container->get(App\ReadModel\InteractionViewInterface::class),
            ))),
    ];
};
