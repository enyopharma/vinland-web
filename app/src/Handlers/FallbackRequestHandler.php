<?php

declare(strict_types=1);

namespace App\Http\Handlers;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class FallbackRequestHandler implements RequestHandlerInterface
{
    private string $message;

    private ?RequestHandlerInterface $handler = null;

    public function __construct(string $message = 'No response')
    {
        $this->message = $message;
    }

    /**
     * @param \Psr\Http\Server\RequestHandlerInterface $handler
     * @return void
     */
    public function setNextHandler(RequestHandlerInterface $handler): void
    {
        $this->handler = $handler;
    }

    /**
     * @inheritdoc
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        if (is_null($this->handler)) {
            throw new \LogicException($this->message);
        }

        return $this->handler->handle($request);
    }
}
