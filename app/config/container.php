<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;

/**
 * A factory producing the application container.
 *
 * @param string    $env
 * @param bool      $debug
 * @return Psr\Container\ContainerInterface
 */
return function (string $env, bool $debug): ContainerInterface {
    $factories = function () {
        $files = glob(__DIR__ . '/../factories/*.php');

        foreach ($files as $file) {
            $factories = require $file;

            if (!is_array($factories)) {
                throw new UnexpectedValueException(sprintf('File \'%s\' must return an array', $file));
            }

            yield from $factories;
        }
    };

    return Quanta\Container::factories($factories());
};
