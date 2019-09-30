<?php

declare(strict_types=1);

use Domain\ReadModel\TaxaViewInterface;
use Domain\ReadModel\InteractionViewInterface;

return [
    TaxaViewInterface::class => fn ($c) => new Domain\ReadModel\TaxaViewSql(
        $c->get(PDO::class),
    ),

    InteractionViewInterface::class => fn ($c) => new Domain\ReadModel\InteractionViewSql(
        $c->get(PDO::class),
    ),
];
