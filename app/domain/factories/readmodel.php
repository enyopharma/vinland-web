<?php

declare(strict_types=1);

use Domain\ReadModel\TaxonViewInterface;
use Domain\ReadModel\ProteinViewInterface;
use Domain\ReadModel\AnnotationViewInterface;
use Domain\ReadModel\InteractionViewInterface;

return [
    ProteinViewInterface::class => fn ($c) => new Domain\ReadModel\ProteinViewSql(
        $c->get(PDO::class),
    ),

    AnnotationViewInterface::class => fn ($c) => new Domain\ReadModel\AnnotationViewSql(
        $c->get(PDO::class),
    ),

    TaxonViewInterface::class => fn ($c) => new Domain\ReadModel\TaxonViewSql(
        $c->get(PDO::class),
    ),

    InteractionViewInterface::class => fn ($c) => new Domain\ReadModel\InteractionViewSql(
        $c->get(PDO::class),
    ),
];
