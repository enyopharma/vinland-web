<?php

declare(strict_types=1);

namespace App\ReadModel;

use App\Request\QueryInput;

interface InteractionViewInterface
{
    public function all(QueryInput $query): Statement;
}
