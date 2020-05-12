<?php

declare(strict_types=1);

namespace App\Endpoints\Taxa\Related;

use Psr\Http\Message\ServerRequestInterface;

use App\ReadModel\TaxonViewInterface;

final class IndexEndpoint
{
    private TaxonViewInterface $taxa;

    public function __construct(TaxonViewInterface $taxa)
    {
        $this->taxa = $taxa;
    }

    /**
     * @return false|array
     */
    public function __invoke(ServerRequestInterface $request)
    {
        $ncbi_taxon_id = (int) $request->getAttribute('ncbi_taxon_id');

        return $this->taxa->id($ncbi_taxon_id, ['related'])->fetch();
    }
}
