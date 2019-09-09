<?php

declare(strict_types=1);

use App\Http\Extensions\Plates\UrlExtension;
use App\Http\Extensions\Plates\AssetsExtension;

use League\Plates\Engine;
use League\Plates\Extension\ExtensionInterface;

return [
    Engine::class => function ($container) {
        $engine = new Engine(__DIR__ . '/../templates', 'php');

        $engine->loadExtension($container->get(AssetsExtension::class));
        $engine->loadExtension($container->get(UrlExtension::class));

        return $engine;
    },

    AssetsExtension::class => fn () => new AssetsExtension(
        __DIR__ . '/../public/build/manifest.json'
    ),

    UrlExtension::class => fn ($c) => new UrlExtension(
        $c->get(Zend\Expressive\Helper\UrlHelper::class)
    ),
];
