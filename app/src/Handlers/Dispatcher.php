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

    public static function stack(MiddlewareInterface ...$middleware): RequestHandlerInterface
    {
        return ($head = array_pop($middleware) ?? false)
            ? new self(self::stack(...$middleware), $head)
            : new InnerMostRequestHandler;
    }

    public static function queue(MiddlewareInterface ...$middleware): RequestHandlerInterface
    {
        return ($head = array_shift($middleware) ?? false)
            ? new self(self::queue(...$middleware), $head)
            : new InnerMostRequestHandler;
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
