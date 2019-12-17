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
 * @param Psr\Container\ContainerInterface $container
 * @return Psr\Http\Server\RequestHandlerInterface
 */
return function (ContainerInterface $container): RequestHandlerInterface {
    /**
     * Get the middleware.
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
