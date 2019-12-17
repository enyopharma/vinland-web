<?php

declare(strict_types=1);

namespace App\Http\Handlers;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class Dispatcher implements RequestHandlerInterface
{
    private RequestHandlerInterface $handler;

    private MiddlewareInterface $middleware;

    public static function stack(RequestHandlerInterface $handler, MiddlewareInterface $head = null, MiddlewareInterface ...$tail): RequestHandlerInterface
    {
        return is_null($head) ? $handler : self::stack(new self($handler, $head), ...$tail);
    }

    public static function queue(RequestHandlerInterface $handler, MiddlewareInterface $head = null, MiddlewareInterface ...$tail): RequestHandlerInterface
    {
        return is_null($head) ? $handler : new self(self::queue($handler, ...$tail), $head);
    }

    public function __construct(RequestHandlerInterface $handler, MiddlewareInterface $middleware)
    {
        $this->handler = $handler;
        $this->middleware = $middleware;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return $this->middleware->process($request, $this->handler);
    }
}
