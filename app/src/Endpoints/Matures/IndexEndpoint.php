<?php

declare(strict_types=1);

namespace App\Endpoints\Matures;

use App\ReadModel\TaxonViewInterface;
use App\ReadModel\MatureViewInterface;

final class IndexEndpoint
{
    public function __construct(
        private TaxonViewInterface $taxa,
        private MatureViewInterface $matures,
    ) {
    }

    public function __invoke(callable $input): iterable|null
    {
        $ncbi_taxon_id = (int) $input('ncbi_taxon_id');

        if (!$taxon = $this->taxa->id($ncbi_taxon_id)->fetch()) {
            return null;
        }

        return $this->matures->taxon($taxon['left_value'], $taxon['right_value']);
    }
}
