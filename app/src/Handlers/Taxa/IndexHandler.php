<?php

declare(strict_types=1);

namespace App\Http\Handlers\Taxa;

use Psr\Http\Server\RequestHandlerInterface;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Domain\ReadModel\TaxonViewInterface;

final class IndexHandler implements RequestHandlerInterface
{
    private ResponseFactoryInterface $factory;

    private TaxonViewInterface $taxa;

    public function __construct(ResponseFactoryInterface $factory, TaxonViewInterface $taxa)
    {
        $this->factory = $factory;
        $this->taxa = $taxa;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $params = (array) $request->getQueryParams();

        $query = (string) ($params['query'] ?? '');
        $limit = (int) ($params['limit'] ?? 5);

        $select_taxa_sth = $this->taxa->all($query, $limit);

        $response = $this->factory->createResponse(200);

        $response->getBody()->write((string) json_encode([
            'success' => true,
            'code' => 200,
            'data' => $select_taxa_sth->fetchAll(),
        ]));

        return $response->withHeader('content-type', 'application/json');
    }
}
