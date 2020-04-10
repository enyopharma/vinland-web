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
    $protein = new App\Middleware\FetchProteinMiddleware(
        $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
        $container->get(App\ReadModel\ProteinViewInterface::class),
    );

    $isoform = new App\Middleware\FetchIsoformMiddleware(
        $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
    );

    $taxon = new App\Middleware\FetchTaxonMiddleware(
        $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
        $container->get(App\ReadModel\TaxonViewInterface::class),
    );

    return [
        'GET /proteins' => new App\Handlers\Proteins\IndexHandler(
            $container->get(App\Responders\JsonResponder::class),
            $container->get(App\ReadModel\ProteinViewInterface::class),
        ),

        'GET /proteins/{protein_id:\d+}' => Quanta\Http\RequestHandler::queue(
            new App\Handlers\Proteins\ShowHandler(
                $container->get(App\Responders\JsonResponder::class),
            ),
            $protein,
        ),

        'GET /proteins/{protein_id:\d+}/isoforms/{isoform_id:\d+}' => Quanta\Http\RequestHandler::queue(
            new App\Handlers\Proteins\Isoforms\ShowHandler(
                $container->get(App\Responders\JsonResponder::class),
            ),
            $protein,
            $isoform,
        ),

        'GET /annotations' => new App\Handlers\Annotations\IndexHandler(
            $container->get(App\Responders\JsonResponder::class),
            $container->get(App\ReadModel\AnnotationViewInterface::class),
        ),

        'GET /taxa' => new App\Handlers\Taxa\IndexHandler(
            $container->get(App\Responders\JsonResponder::class),
            $container->get(App\ReadModel\TaxonViewInterface::class),
        ),

        'GET /taxa/{ncbi_taxon_id:\d+}/related' => Quanta\Http\RequestHandler::queue(
            new App\Handlers\Taxa\Related\IndexHandler(
                $container->get(App\Responders\JsonResponder::class),
            ),
            $taxon,
        ),

        'GET /taxa/{ncbi_taxon_id:\d+}/names' => Quanta\Http\RequestHandler::queue(
            new App\Handlers\Taxa\Names\IndexHandler(
                $container->get(App\Responders\JsonResponder::class),
            ),
            $taxon,
        ),

        'POST /interactions' => Quanta\Http\RequestHandler::queue(
            new App\Handlers\Interactions\IndexHandler(
                $container->get(App\Responders\JsonResponder::class),
                $container->get(App\ReadModel\InteractionViewInterface::class),
            ),
            new Middlewares\JsonPayload,
            new App\Middleware\InputValidationMiddleware(
                $container->get(App\Responders\JsonResponder::class),
                [App\Request\QueryInput::class, 'from'],
            ),
        ),
    ];
};
