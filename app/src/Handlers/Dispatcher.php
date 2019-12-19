<?php

declare(strict_types=1);

namespace App\Http\Handlers;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class Dispatcher implements MiddlewareInterface, RequestHandlerInterface
{
    /**
     * @var \App\Http\Handlers\Dispatcher|\App\Http\Handlers\FallbackRequestHandler
     */
    private RequestHandlerInterface $handler;

    /**
     * @var \Psr\Http\Server\MiddlewareInterface
     */
    private MiddlewareInterface $middleware;

    /**
     * @param \Psr\Http\Server\MiddlewareInterface ...$middleware
     * @return \App\Http\Handlers\Dispatcher|\App\Http\Handlers\FallbackRequestHandler
     */
    public static function stack(MiddlewareInterface ...$middleware): RequestHandlerInterface
    {
        return ($head = array_pop($middleware) ?? false)
            ? new self(self::stack(...$middleware), $head)
            : new FallbackRequestHandler;
    }

    /**
     * @param \Psr\Http\Server\MiddlewareInterface ...$middleware
     * @return \App\Http\Handlers\Dispatcher|\App\Http\Handlers\FallbackRequestHandler
     */
    public static function queue(MiddlewareInterface ...$middleware): RequestHandlerInterface
    {
        return ($head = array_shift($middleware) ?? false)
            ? new self(self::queue(...$middleware), $head)
            : new FallbackRequestHandler;
    }

    /**
     * @param \App\Http\Handlers\Dispatcher|\App\Http\Handlers\FallbackRequestHandler   $handler
     * @param \Psr\Http\Server\MiddlewareInterface                                      $middleware
     */
    private function __construct(RequestHandlerInterface $handler, MiddlewareInterface $middleware)
    {
        $this->handler = $handler;
        $this->middleware = $middleware;
    }

    /**
     * @param \Psr\Http\Server\RequestHandlerInterface $handler
     * @return void
     */
    private function setNextHandler(RequestHandlerInterface $handler): void
    {
        $this->handler->setNextHandler($handler);
    }

   /**
     * @inheritdoc
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return $this->middleware->process($request, $this->handler);
    }

    /**
     * @inheritdoc
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        // pass the given request handler to the last request handler.
        $this->handler->setNextHandler($handler);

        return $this->middleware->process($request, $this->handler);
    }
}
