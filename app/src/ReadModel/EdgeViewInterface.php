<?php

declare(strict_types=1);

namespace App\ReadModel;

interface EdgeViewInterface
{
    public function protein(string $type, int $protein_id, int $isoform_id): Statement;
}
