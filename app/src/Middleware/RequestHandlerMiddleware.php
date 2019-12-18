<?php declare(strict_types=1);

namespace App\Http\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class RequestHandlerMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $matched = $request->getAttribute(RequestHandlerInterface::class, false);

        if ($matched === false) {
            return $handler->handle($request);
        }

        if ($matched instanceof RequestHandlerInterface) {
            return $matched->handle($request);
        }

        throw new \UnexpectedValueException(
            vsprintf('Request attribute \'%s\' must be an implementation of %s, %s given', [
                RequestHandlerInterface::class,
                RequestHandlerInterface::class,
                gettype($matched),
            ])
        );
    }
}
