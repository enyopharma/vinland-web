<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

final class ServerErrorMiddleware implements MiddlewareInterface
{
    public function __construct(
        private ResponseFactoryInterface $factory,
        private bool $debug
    ) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
            return $handler->handle($request);
        }

        catch (\Throwable $e) {
            return $this->serverErrorResponse($e);
        }
    }

    public function serverErrorResponse(\Throwable $e): ResponseInterface
    {
        $error = !$this->debug ? [] : [
            'error' => [
                'code' => $e->getCode(),
                'type' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'message' => $e->getMessage(),
                'trace' => preg_split('/[\n\r]+/', $e->getTraceAsString()),
            ],
        ];

        $data = ['code' => 500, 'success' => false, 'data' => []] + $error;

        $contents = json_encode($data, JSON_THROW_ON_ERROR);

        $response = $this->factory->createResponse(500);

        $response->getBody()->write($contents);

        return $response->withHeader('content-type', 'application/json');
    }
}
