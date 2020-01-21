<?php

declare(strict_types=1);

namespace App\Http\Handlers\Taxa;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use Domain\ReadModel\TaxonViewInterface;

use App\Http\Responders\JsonResponder;

final class ShowHandler implements RequestHandlerInterface
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

        $select_taxa_sth = $this->taxa->id($ncbi_taxon_id);

        return ($taxon = $select_taxa_sth->fetch())
            ? $this->responder->success($taxon)
            : $this->responder->notFound();
    }
}
