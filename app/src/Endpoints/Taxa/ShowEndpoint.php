<?php

declare(strict_types=1);

namespace App\Endpoints\Taxa;

use App\ReadModel\TaxonViewInterface;

final class ShowEndpoint
{
    public function __construct(
        private TaxonViewInterface $taxa,
    ) {}

    public function __invoke(callable $input): array|false
    {
        $ncbi_taxon_id = (int) $input('ncbi_taxon_id');
        $option = $input('option', null);

        $with = is_null($option) ? [] : [$option];

        return $this->taxa->id($ncbi_taxon_id, ...$with)->fetch();
    }
}
