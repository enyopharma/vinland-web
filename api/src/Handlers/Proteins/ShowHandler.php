<?php

declare(strict_types=1);

namespace App\Handlers\Proteins;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use App\Responders\JsonResponder;
use App\ReadModel\ProteinViewInterface;

final class ShowHandler implements RequestHandlerInterface
{
    private JsonResponder $responder;

    private ProteinViewInterface $proteins;

    public function __construct(JsonResponder $responder, ProteinViewInterface $proteins)
    {
        $this->responder = $responder;
        $this->proteins = $proteins;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $protein_id = (int) $request->getAttribute('protein_id');

        $sth = $this->proteins->id($protein_id, ['isoforms']);

        return ($protein = $sth->fetch())
            ? $this->responder->success($protein)
            : $this->responder->notFound();
    }
}
