<?php

declare(strict_types=1);

namespace App\Endpoints\Taxa;

use App\ReadModel\TaxonViewInterface;

final class ShowEndpoint
{
    private TaxonViewInterface $taxa;

    public function __construct(TaxonViewInterface $taxa)
    {
        $this->taxa = $taxa;
    }

    /**
     * @return false|array
     */
    public function __invoke(callable $input)
    {
        $ncbi_taxon_id = (int) $input('ncbi_taxon_id');
        $option = $input('option', null);

        $with = is_null($option) ? [] : [$option];

        return $this->taxa->id($ncbi_taxon_id, ...$with)->fetch();
    }
}
