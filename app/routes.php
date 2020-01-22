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
            $container->get(App\Http\Responders\JsonResponder::class),
            $container->get(Domain\ReadModel\AnnotationViewInterface::class),
        ),

        'GET /taxa' => new App\Http\Handlers\Taxa\IndexHandler(
            $container->get(App\Http\Responders\JsonResponder::class),
            $container->get(Domain\ReadModel\TaxonViewInterface::class),
        ),

        'GET /taxa/{ncbi_taxon_id:\d+}/names' => new Quanta\Http\RequestHandler(
            new App\Http\Handlers\Taxa\Names\IndexHandler(
                $container->get(App\Http\Responders\JsonResponder::class),
                $container->get(Domain\ReadModel\TaxonViewInterface::class),
            ),
            new App\Http\Middleware\FetchTaxonMiddleware(
                $container->get(App\Http\Responders\JsonResponder::class),
                $container->get(Domain\ReadModel\TaxonViewInterface::class),
            ),
        ),

        'GET /taxa/{ncbi_taxon_id:\d+}/children' => new Quanta\Http\RequestHandler(
            new App\Http\Handlers\Taxa\Children\IndexHandler(
                $container->get(App\Http\Responders\JsonResponder::class),
                $container->get(Domain\ReadModel\TaxonViewInterface::class),
            ),
            new App\Http\Middleware\FetchTaxonMiddleware(
                $container->get(App\Http\Responders\JsonResponder::class),
                $container->get(Domain\ReadModel\TaxonViewInterface::class),
            ),
        ),

        'POST /interactions' => new Quanta\Http\RequestHandler(
            new App\Http\Handlers\Interactions\IndexHandler(
                $container->get(App\Http\Responders\JsonResponder::class),
                $container->get(Domain\ReadModel\InteractionViewInterface::class),
            ),
            new App\Http\Middleware\InputValidationMiddleware(
                $container->get(App\Http\Responders\JsonResponder::class),
                [Domain\Input\QueryInput::class, 'from'],
            ),
        ),
    ];
};
