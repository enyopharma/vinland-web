<?php

declare(strict_types=1);

namespace App\ReadModel;

interface DescriptionViewInterface
{
    public function all(int $interaction_id): Statement;
}
