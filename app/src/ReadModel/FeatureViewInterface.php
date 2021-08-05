<?php

declare(strict_types=1);

namespace App\ReadModel;

interface FeatureViewInterface
{
    public function all(int $isoform_id): Statement;
}
