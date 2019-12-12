<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use App\Http\Handlers\Dispatcher;
use App\Http\Handlers\NotFoundRequestHandler;

/**
 * A factory producing the application request handler.
 *
 * @param string    $env
 * @param bool      $debug
 * @return Psr\Http\Server\RequestHandlerInterface
 */
return function (string $env, bool $debug): RequestHandlerInterface {
    /**
     * Build the container.
     */
    $files = array_merge(
        (array) glob(__DIR__ . '/../app/factories/*.php'),
        (array) glob(__DIR__ . '/../domain/factories/*.php'),
        (array) glob(__DIR__ . '/../infrastructure/factories/*.php'),
    );

    $container = new Quanta\Container(array_reduce($files, function ($factories, $file) {
        return array_merge($factories, require $file);
    }, []));

    /**
     * Run the boot scripts.
     */
    foreach ((array) glob(__DIR__ . '/boot/*.php') as $boot) {
        (require $boot)($container);
    }

    /**
     * Get the middleware factories.
     */
    $middleware = (require __DIR__ . '/middleware.php')($container);

    /**
     * Get the inner most request handler.
     */
    $handler = new NotFoundRequestHandler(
        $container->get(ResponseFactoryInterface::class),
    );

    /**
     * Return the application.
     */
    return Dispatcher::queue($handler, ...$middleware);
};
