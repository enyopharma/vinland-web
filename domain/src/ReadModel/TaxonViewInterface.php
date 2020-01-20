<?php

declare(strict_types=1);

namespace Domain\ReadModel;

interface TaxonViewInterface
{
    public function id(int $ncbi_taxon_id): Statement;

    public function all(string $query, int $limit): Statement;
}
