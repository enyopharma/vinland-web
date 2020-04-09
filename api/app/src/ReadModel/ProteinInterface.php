<?php

declare(strict_types=1);

namespace App\ReadModel;

interface ProteinInterface extends EntityInterface
{
    public function isoforms(): IsoformViewInterface;

    public function withIsoforms(): self;
}
