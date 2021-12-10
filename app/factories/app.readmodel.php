<?php

declare(strict_types=1);

use App\ReadModel\StatViewInterface;
use App\ReadModel\TaxonViewInterface;
use App\ReadModel\ProteinViewInterface;
use App\ReadModel\IsoformViewInterface;
use App\ReadModel\FeatureViewInterface;
use App\ReadModel\MappingViewInterface;
use App\ReadModel\AnnotationViewInterface;
use App\ReadModel\InteractorViewInterface;
use App\ReadModel\InteractionViewInterface;
use App\ReadModel\DescriptionViewInterface;

return [
    AnnotationViewInterface::class => fn ($c) => new App\ReadModel\AnnotationViewSql(
        $c->get(PDO::class),
    ),

    ProteinViewInterface::class => fn ($c) => new App\ReadModel\ProteinViewSql(
        $c->get(PDO::class),
    ),

    IsoformViewInterface::class => fn ($c) => new App\ReadModel\IsoformViewSql(
        $c->get(PDO::class),
    ),

    FeatureViewInterface::class => fn ($c) => new App\ReadModel\FeatureViewSql(
        $c->get(PDO::class),
    ),

    MappingViewInterface::class => fn ($c) => new App\ReadModel\MappingViewSql(
        $c->get(PDO::class),
    ),

    InteractorViewInterface::class => fn ($c) => new App\ReadModel\InteractorViewSql(
        $c->get(PDO::class),
    ),

    DescriptionViewInterface::class => fn ($c) => new App\ReadModel\DescriptionViewSql(
        $c->get(PDO::class),
    ),

    TaxonViewInterface::class => fn ($c) => new App\ReadModel\TaxonViewSql(
        $c->get(PDO::class),
    ),

    InteractionViewInterface::class => fn ($c) => new App\ReadModel\InteractionViewSql(
        $c->get(PDO::class),
    ),

    StatViewInterface::class => fn ($c) => new App\ReadModel\StatViewCache(
        new App\ReadModel\StatViewSql($c->get(PDO::class)),
        $c->get(Predis\Client::class),
    ),
];
