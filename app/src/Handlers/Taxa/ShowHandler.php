<?php

declare(strict_types=1);

namespace App\Http\Handlers\Taxa;

use Psr\Http\Server\RequestHandlerInterface;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Domain\ReadModel\TaxonViewInterface;

final class ShowHandler implements RequestHandlerInterface
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
        $ncbi_taxon_id = (int) $request->getAttribute('ncbi_taxon_id');

        $select_taxa_sth = $this->taxa->id($ncbi_taxon_id);

        if (! $taxon = $select_taxa_sth->fetch()) {
            return $this->factory->createResponse(404);
        }

        $response = $this->factory->createResponse(200);

        $response->getBody()->write((string) json_encode([
            'success' => true,
            'code' => 200,
            'data' => $taxon,
        ]));

        return $response->withHeader('content-type', 'application/json');
    }
}
