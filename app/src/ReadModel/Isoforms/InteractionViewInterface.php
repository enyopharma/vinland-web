<?php

declare(strict_types=1);

namespace App\ReadModel\Isoforms;

use App\ReadModel\Statement;

interface InteractionViewInterface
{
    public function isoform(string $type, int $protein_id, int $isoform_id): Statement;
}
