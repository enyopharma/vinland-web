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
    $responder = new Quanta\Http\Responder(
        $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
    );

    $handler = function ($xs) use ($responder) {
        [$f, $middleware] = is_array($xs) ? [array_shift($xs), $xs] : [$xs, []];

        if (!is_callable($f)) {
            throw new \LogicException('invalid endpoint');
        }

        $endpoint = new Quanta\Http\Endpoint($responder, $f);

        return count($middleware) > 0
            ? Quanta\Http\RequestHandler::queue($endpoint, ...$middleware)
            : $endpoint;
    };

    return array_map($handler, [
        'GET /proteins' => new App\Endpoints\Proteins\IndexEndpoint(
            $container->get(App\ReadModel\ProteinViewInterface::class),
        ),

        'GET /proteins/{protein_id:\d+}' => new App\Endpoints\Proteins\ShowEndpoint(
            $container->get(App\ReadModel\ProteinViewInterface::class),
        ),

        'GET /proteins/{protein_id:\d+}/isoforms' => new App\Endpoints\Isoforms\IndexEndpoint(
            $container->get(App\ReadModel\ProteinViewInterface::class),
            $container->get(App\ReadModel\IsoformViewInterface::class),
        ),

        'GET /proteins/{protein_id:\d+}/isoforms/{isoform_id:\d+}' => new App\Endpoints\Isoforms\ShowEndpoint(
            $container->get(App\ReadModel\ProteinViewInterface::class),
            $container->get(App\ReadModel\IsoformViewInterface::class),
        ),

        'GET /proteins/{protein_id:\d+}/isoforms/{isoform_id:\d+}/interactions/{type:hh|vh}' => new App\Endpoints\Isoforms\Interactions\IndexEndpoint(
            $container->get(App\ReadModel\ProteinViewInterface::class),
            $container->get(App\ReadModel\IsoformViewInterface::class),
            $container->get(App\ReadModel\Isoforms\InteractionViewInterface::class),
        ),

        'GET /interactions/{interaction_id:\d+}' => new App\Endpoints\Interactions\ShowEndpoint(
            $container->get(App\ReadModel\InteractionViewInterface::class),
            $container->get(App\ReadModel\DescriptionViewInterface::class),
        ),

        'GET /annotations' => new App\Endpoints\Annotations\IndexEndpoint(
            $container->get(App\ReadModel\AnnotationViewInterface::class),
        ),

        'GET /taxa' => new App\Endpoints\Taxa\IndexEndpoint(
            $container->get(App\ReadModel\TaxonViewInterface::class),
        ),

        'GET /taxa/{ncbi_taxon_id:\d+}[/{option:related|names}]' => new App\Endpoints\Taxa\ShowEndpoint(
            $container->get(App\ReadModel\TaxonViewInterface::class),
        ),

        'POST /interactions' => [
            new App\Endpoints\Interactions\IndexEndpoint(
                $container->get(App\ReadModel\InteractionViewInterface::class),
            ),
            new Middlewares\JsonPayload,
            new App\Middleware\InputValidationMiddleware(
                $container->get(Psr\Http\Message\ResponseFactoryInterface::class),
                App\Input\InteractionQueryInput::factory(),
            ),
        ],
    ]);
};
