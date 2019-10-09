<?php

declare(strict_types=1);

namespace Domain\ReadModel;

interface TaxaViewInterface
{
    public function all(string $query, int $limit): Statement;
}
