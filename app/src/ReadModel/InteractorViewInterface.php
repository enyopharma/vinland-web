<?php

declare(strict_types=1);

namespace App\ReadModel;

interface InteractorViewInterface
{
    public function all(string $type, int $protein_id, int $isoform_id): Statement;
}
