<?php

declare(strict_types=1);

namespace App\Handlers\Proteins\Isoforms;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use App\ReadModel\IsoformInterface;

use App\Responders\JsonResponder;

final class ShowHandler implements RequestHandlerInterface
{
    private JsonResponder $responder;

    public function __construct(JsonResponder $responder)
    {
        $this->responder = $responder;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $isoform = $request->getAttribute(IsoformInterface::class);

        if (! $isoform instanceof IsoformInterface) {
            throw new \LogicException;
        }

        $data = $isoform->withInteractions()->data();

        return $this->responder->success($data);
    }
}
