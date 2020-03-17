<?php

declare(strict_types=1);

namespace Domain\ReadModel;

use Domain\Input\QueryInput;

interface InteractionViewInterface
{
    public function all(QueryInput $query): Statement;
}
