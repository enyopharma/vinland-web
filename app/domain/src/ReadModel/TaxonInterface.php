<?php

declare(strict_types=1);

namespace Domain\ReadModel;

interface TaxonInterface extends EntityInterface
{
    public function withRelated(): self;

    public function withNames(): self;
}
