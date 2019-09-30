<?php

declare(strict_types=1);

use Domain\Input\QueryValidation;

return [
    QueryValidation::class => fn ($c) => new QueryValidation(
        $c->get(PDO::class),
    ),
];
