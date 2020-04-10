<?php

declare(strict_types=1);

namespace App\ReadModel;

interface IsoformInterface extends EntityInterface
{
    public function withInteractions(): self;
}
