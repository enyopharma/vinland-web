<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;

/**
 * Return the route definitions.
 *
 * @param Psr\Container\ContainerInterface $container
 * @return \Psr\Http\Server\RequestHandlerInterface[]
 */
return function (ContainerInterface $container): array {
    $factory = $container->get(Psr\Http\Message\ResponseFactoryInterface::class);

    $responder = new Quanta\Http\Responder($factory);

    $endpoint = fn (callable $f) => new Quanta\Http\Endpoint($responder, $f, 'data', [
        'code' => 200,
        'success' => true,
    ]);

    return [
        'GET /proteins' => $endpoint(new App\Endpoints\Proteins\IndexEndpoint(
            $container->get(App\ReadModel\ProteinViewInterface::class),
        )),

        'GET /proteins/{protein_id:\d+}' => $endpoint(new App\Endpoints\Proteins\ShowEndpoint(
            $container->get(App\ReadModel\ProteinViewInterface::class),
        )),

        'GET /proteins/{protein_id:\d+}/isoforms/{isoform_id:\d+}' => $endpoint(new App\Endpoints\Proteins\Isoforms\ShowEndpoint(
            $container->get(App\ReadModel\IsoformViewInterface::class),
        )),

        'GET /annotations' => $endpoint(new App\Endpoints\Annotations\IndexEndpoint(
            $container->get(App\ReadModel\AnnotationViewInterface::class),
        )),

        'GET /taxa' => $endpoint(new App\Endpoints\Taxa\IndexEndpoint(
            $container->get(App\ReadModel\TaxonViewInterface::class),
        )),

        'GET /taxa/{ncbi_taxon_id:\d+}[/{option:related|names}]' => $endpoint(new App\Endpoints\Taxa\ShowEndpoint(
            $container->get(App\ReadModel\TaxonViewInterface::class),
        )),

        'POST /interactions' => Quanta\Http\RequestHandler::queue(
            $endpoint(new App\Endpoints\Interactions\IndexEndpoint(
                $container->get(App\ReadModel\InteractionViewInterface::class),
            )),
            new Middlewares\JsonPayload,
            new App\Middleware\InputValidationMiddleware(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                App\Input\InteractionQueryInput::factory(),
            ),
        ),
    ];
};
