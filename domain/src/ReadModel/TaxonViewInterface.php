<?php

declare(strict_types=1);

namespace Domain\ReadModel;

interface TaxonViewInterface
{
    public function id(int $ncbi_taxon_id): Statement;

    public function all(string $query, int $limit): Statement;

    public function names(int $left_value, int $right_value): Statement;

    public function children(int $taxon_id): Statement;
}
