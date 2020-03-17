<?php

declare(strict_types=1);

namespace App\Http\Handlers\Taxa\Related;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use Domain\ReadModel\TaxonInterface;

use App\Http\Responders\JsonResponder;

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

        $taxon = $taxon->withRelated();

        return $this->responder->success($taxon->data());
    }
}
