<?php

declare(strict_types=1);

use Domain\ReadModel\TaxaViewInterface;
use Domain\ReadModel\AnnotationViewInterface;
use Domain\ReadModel\InteractionViewInterface;

return [
    AnnotationViewInterface::class => fn ($c) => new Domain\ReadModel\AnnotationViewSql(
        $c->get(PDO::class),
    ),

    TaxaViewInterface::class => fn ($c) => new Domain\ReadModel\TaxaViewSql(
        $c->get(PDO::class),
    ),

    InteractionViewInterface::class => fn ($c) => new Domain\ReadModel\InteractionViewSql(
        $c->get(PDO::class),
    ),
];
