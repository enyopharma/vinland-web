<?php

declare(strict_types=1);

namespace Domain\ReadModel;

interface ProteinViewInterface
{
    public function id(int $ncbi_taxon_id): Statement;

    public function search(string $type, string $query, int $limit): Statement;
}
