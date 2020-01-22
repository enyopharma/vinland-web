<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use Domain\ReadModel\TaxonViewInterface;

use App\Http\Responders\JsonResponder;

final class FetchTaxonMiddleware implements MiddlewareInterface
{
    private JsonResponder $responder;

    private TaxonViewInterface $taxa;

    public function __construct(JsonResponder $responder, TaxonViewInterface $taxa)
    {
        $this->responder = $responder;
        $this->taxa = $taxa;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $ncbi_taxon_id = (int) $request->getAttribute('ncbi_taxon_id');

        $select_taxon_sth = $this->taxa->id($ncbi_taxon_id);

        return ($taxon = $select_taxon_sth->fetch())
            ? $this->success($request, $handler, $taxon)
            : $this->failure();
    }

    private function success(ServerRequestInterface $request, RequestHandlerInterface $handler, array $taxon): ResponseInterface
    {
        $request = $request->withAttribute('taxon', $taxon);

        return $handler->handle($request);
    }

    private function failure(): ResponseInterface
    {
        return $this->responder->notFound();
    }
}
