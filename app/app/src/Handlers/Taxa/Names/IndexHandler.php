<?php

declare(strict_types=1);

namespace App\Handlers\Taxa\Names;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use App\ReadModel\TaxonInterface;

use App\Responders\JsonResponder;

final class IndexHandler implements RequestHandlerInterface
{
    private JsonResponder $responder;

    public function __construct(JsonResponder $responder)
    {
        $this->responder = $responder;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $taxon = $request->getAttribute(TaxonInterface::class);

        if (! $taxon instanceof TaxonInterface) {
            throw new \LogicException;
        }

        $taxon = $taxon->withNames();

        return $this->responder->success($taxon->data());
    }
}
