<?php

declare(strict_types=1);

/**
 * Set up the autoloader.
 */
require __DIR__ . '/../vendor/autoload.php';

/**
 * Complete the env with local values.
 */
(new Symfony\Component\Dotenv\Dotenv(false))->load(__DIR__ . '/../.env');

/**
 * Get the env and debug mod from the env var.
 */
$environment = $_ENV['APP_ENV'] ?? 'production';
$debug = filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOLEAN);

/**
 * Get the http application.
 */
$application = (require __DIR__ . '/../app/handler.php')($environment, $debug);

/**
 * Wrapp the http application insinde a fake http server.
 */
$server = new App\Http\Server(
    new App\Http\Server\NyholmContext(
        $application
    )
);

/**
 * Run the http server.
 */
$server->run();
