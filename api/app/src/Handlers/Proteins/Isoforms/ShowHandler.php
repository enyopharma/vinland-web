<?php

declare(strict_types=1);

namespace App\Handlers\Proteins\Isoforms;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use App\ReadModel\ProteinInterface;

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
        $protein = $request->getAttribute(ProteinInterface::class);

        if (! $protein instanceof ProteinInterface) {
            throw new \LogicException;
        }

        $params = (array) $request->getAttributes();

        $id = (int) ($params['id'] ?? 0);

        $isoform = $protein->isoforms()->id($id)->fetch();

        if (! $isoform) {
            return $this->responder->notFound();
        }

        $data = $isoform->data();

        return $this->responder->success($data);
    }
}
