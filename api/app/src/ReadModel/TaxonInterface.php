<?php

declare(strict_types=1);

namespace App\ReadModel;

interface TaxonInterface extends EntityInterface
{
    public function withRelated(): self;

    public function withNames(): self;
}
