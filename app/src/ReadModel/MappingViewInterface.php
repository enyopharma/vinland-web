<?php

declare(strict_types=1);

namespace App\ReadModel;

interface MappingViewInterface
{
    public function targeting(int $protein_id, int $length): Statement;
}
