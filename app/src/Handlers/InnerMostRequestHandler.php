<?php

declare(strict_types=1);

namespace App\Http\Handlers;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class InnerMostRequestHandler implements RequestHandlerInterface
{
    private string $message;

    public function __construct(string $message = 'No response')
    {
        $this->message = $message;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        throw new \LogicException($this->message);
    }
}
