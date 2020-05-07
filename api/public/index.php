<?php

declare(strict_types=1);

/**
 * Set up the autoloader.
 */
require __DIR__ . '/../vendor/autoload.php';

/**
 * Complete the env with local values when exists.
 */
if (file_exists(__DIR__ . '/../.env')) {
    (new Symfony\Component\Dotenv\Dotenv(false))->load(__DIR__ . '/../.env');
}

/**
 * Set the app debug state and env.
 */
$_ENV['APP_ENV'] = $_ENV['APP_ENV'] ?? 'production';
$_ENV['APP_DEBUG'] = filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOLEAN);

/**
 * Get the http request handler.
 */
$app = require __DIR__ . '/../src/app.php';

/**
 * Run the application.
 */
use function Http\Response\send;

$request = GuzzleHttp\Psr7\ServerRequest::fromGlobals();

$response = $app->handle($request);

send($response);
