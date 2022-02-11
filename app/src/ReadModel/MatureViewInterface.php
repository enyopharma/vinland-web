<?php

declare(strict_types=1);

namespace App\ReadModel;

interface MatureViewInterface
{
    public function taxon(int $left_value, int $right_value): Statement;
}
