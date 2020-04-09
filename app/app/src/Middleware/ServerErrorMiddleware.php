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
    private ResponseFactoryInterface $factory;

    private bool $debug;

    public function __construct(ResponseFactoryInterface $factory, bool $debug)
    {
        $this->factory = $factory;
        $this->debug = $debug;
    }

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
        $error = ! $this->debug ? [] : [
            'error' => [
                'code' => $e->getCode(),
                'type' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'message' => $e->getMessage(),
                'trace' => preg_split('/[\n\r]+/', $e->getTraceAsString()),
            ],
        ];

        $contents = json_encode(['code' => 500, 'success' => false, 'data' => []] + $error);

        if ($contents === false) {
            throw new \Exception(json_last_error_msg());
        }

        $response = $this->factory->createResponse(500);

        $response->getBody()->write($contents);

        return $response->withHeader('content-type', 'application/json');
    }
}
