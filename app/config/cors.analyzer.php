<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;

use Neomerx\Cors\Analyzer;
use Neomerx\Cors\Strategies\Settings;

return function (ContainerInterface $container): Analyzer {
    $settings = (new Settings)
        ->init('http', $_ENV['APP_HOST'], 80)
        ->setAllowedOrigins(explode(',', $_ENV['ALLOWED_ORIGINS']))
        ->setAllowedMethods(['GET', 'POST'])
        ->setAllowedHeaders(['content-type']);

    return Analyzer::instance($settings);
};
