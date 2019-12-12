<?php

declare(strict_types=1);

namespace App\Http\Handlers\Annotations;

use Psr\Http\Server\RequestHandlerInterface;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Domain\ReadModel\AnnotationViewInterface;

final class IndexHandler implements RequestHandlerInterface
{
    private ResponseFactoryInterface $factory;

    private AnnotationViewInterface $annotations;

    public function __construct(ResponseFactoryInterface $factory, AnnotationViewInterface $annotations)
    {
        $this->factory = $factory;
        $this->annotations = $annotations;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $params = (array) $request->getQueryParams();

        $source = (string) ($params['source'] ?? '');
        $query = (string) ($params['query'] ?? '');
        $limit = (int) ($params['limit'] ?? 5);

        $annotations = $this->annotations->all($source, $query, $limit);

        $response = $this->factory->createResponse(200);

        $response->getBody()->write((string) json_encode([
            'success' => true,
            'code' => 200,
            'data' => $annotations->fetchAll(),
        ]));

        return $response->withHeader('content-type', 'application/json');
    }
}
