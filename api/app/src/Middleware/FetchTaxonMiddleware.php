<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use App\ReadModel\TaxonInterface;
use App\ReadModel\TaxonViewInterface;

use App\Responders\JsonResponder;

final class FetchTaxonMiddleware implements MiddlewareInterface
{
    private ResponseFactoryInterface $factory;

    private TaxonViewInterface $taxa;

    public function __construct(ResponseFactoryInterface $factory, TaxonViewInterface $taxa)
    {
        $this->factory = $factory;
        $this->taxa = $taxa;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $ncbi_taxon_id = (int) $request->getAttribute('ncbi_taxon_id');

        $select_taxon_sth = $this->taxa->id($ncbi_taxon_id);

        if (! $taxon = $select_taxon_sth->fetch()) {
            return $this->factory->createResponse(404);
        }

        $request = $request->withAttribute(TaxonInterface::class, $taxon);

        return $handler->handle($request);
    }
}
