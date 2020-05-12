<?php

declare(strict_types=1);

namespace App\ReadModel;

interface TaxonViewInterface
{
    public function id(int $ncbi_taxon_id, string ...$with): Statement;

    public function search(string $query, int $limit): Statement;
}
