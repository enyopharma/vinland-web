<?php

declare(strict_types=1);

namespace App\ReadModel;

use App\Input\InteractionQueryInput;

interface InteractionViewInterface
{
    public function id(int $id): Statement;

    public function all(InteractionQueryInput $query): Statement;
}
