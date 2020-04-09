<?php

declare(strict_types=1);

use App\ReadModel\TaxonViewInterface;
use App\ReadModel\ProteinViewInterface;
use App\ReadModel\AnnotationViewInterface;
use App\ReadModel\InteractionViewInterface;

return [
    ProteinViewInterface::class => fn ($c) => new App\ReadModel\ProteinViewSql(
        $c->get(PDO::class),
    ),

    AnnotationViewInterface::class => fn ($c) => new App\ReadModel\AnnotationViewSql(
        $c->get(PDO::class),
    ),

    TaxonViewInterface::class => fn ($c) => new App\ReadModel\TaxonViewSql(
        $c->get(PDO::class),
    ),

    InteractionViewInterface::class => fn ($c) => new App\ReadModel\InteractionViewSql(
        $c->get(PDO::class),
    ),
];
