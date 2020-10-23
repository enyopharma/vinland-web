<?php

declare(strict_types=1);

namespace App\ReadModel;

interface IsoformViewInterface
{
    public function id(int $protein_id, int $id): Statement;

    public function all(int $protein_id): Statement;
}
