<?php

declare(strict_types=1);

namespace App\Handlers\Taxa\Related;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use App\Responders\JsonResponder;
use App\ReadModel\TaxonViewInterface;

final class IndexHandler implements RequestHandlerInterface
{
    private JsonResponder $responder;

    private TaxonViewInterface $taxa;

    public function __construct(JsonResponder $responder, TaxonViewInterface $taxa)
    {
        $this->responder = $responder;
        $this->taxa = $taxa;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $ncbi_taxon_id = (int) $request->getAttribute('ncbi_taxon_id');

        $sth = $this->taxa->id($ncbi_taxon_id, ['related']);

        return ($taxon = $sth->fetch())
            ? $this->responder->success($taxon)
            : $this->responder->notFound();
    }
}
