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
        'GET /proteins' => new App\Handlers\Proteins\IndexHandler(
            $container->get(App\Responders\JsonResponder::class),
            $container->get(App\ReadModel\ProteinViewInterface::class),
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
            new App\Middleware\FetchTaxonMiddleware(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                $container->get(App\ReadModel\TaxonViewInterface::class),
            ),
        ),

        'GET /taxa/{ncbi_taxon_id:\d+}/names' => Quanta\Http\RequestHandler::queue(
            new App\Handlers\Taxa\Names\IndexHandler(
                $container->get(App\Responders\JsonResponder::class),
            ),
            new App\Middleware\FetchTaxonMiddleware(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                $container->get(App\ReadModel\TaxonViewInterface::class),
            ),
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
