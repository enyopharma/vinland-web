<?php

declare(strict_types=1);

namespace App\ReadModel;

interface ProteinViewInterface
{
    public function id(int $id): Statement;

    public function all(string $type, string $query, int $limit): Statement;
}
