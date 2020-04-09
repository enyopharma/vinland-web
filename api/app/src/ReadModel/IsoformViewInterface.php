<?php

declare(strict_types=1);

namespace App\ReadModel;

interface IsoformViewInterface
{
    public function id(int $id): Statement;
}
