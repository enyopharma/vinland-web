<?php

declare(strict_types=1);

namespace App\Handlers\Proteins\Isoforms;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use App\Responders\JsonResponder;
use App\ReadModel\IsoformViewInterface;

final class ShowHandler implements RequestHandlerInterface
{
    private JsonResponder $responder;

    private IsoformViewInterface $isoforms;

    public function __construct(JsonResponder $responder, IsoformViewInterface $isoforms)
    {
        $this->responder = $responder;
        $this->isoforms = $isoforms;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $protein_id = (int) $request->getAttribute('protein_id');
        $isoform_id = (int) $request->getAttribute('isoform_id');

        $sth = $this->isoforms->id($protein_id, $isoform_id, ['interactions']);

        return ($isoform = $sth->fetch())
            ? $this->responder->success($isoform)
            : $this->responder->notFound();
    }
}
