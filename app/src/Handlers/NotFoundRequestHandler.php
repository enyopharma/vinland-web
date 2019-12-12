<?php

declare(strict_types=1);

namespace App\Http\Handlers;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

final class NotFoundRequestHandler implements RequestHandlerInterface
{
    private ResponseFactoryInterface $factory;

    public function __construct(ResponseFactoryInterface $factory)
    {
        $this->factory = $factory;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $response = $this->factory
            ->createResponse(404)
            ->withHeader('content-type', 'application/json');

        $response->getBody()->write((string) json_encode([
            'code' => 404,
            'success' => false,
            'reason' => sprintf('Path %s does not exists', $request->getUri()->getPath()),
            'data' => [],
        ]));

        return $response;
    }
}
