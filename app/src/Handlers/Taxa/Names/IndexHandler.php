<?php

declare(strict_types=1);

namespace App\Http\Handlers\Taxa\Names;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use Domain\ReadModel\TaxonViewInterface;

use App\Http\Responders\JsonResponder;

final class IndexHandler implements RequestHandlerInterface
{
    private JsonResponder $responder;

    private TaxonViewInterface $taxa;

    public function __construct(JsonResponder $responder, TaxonViewInterface $taxa)
    {
        $this->responder = $responder;
        $this->taxa = $taxa;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        if (is_null($taxon = $request->getAttribute('taxon'))) {
            throw new \LogicException;
        }

        $names = $this->taxa->names($taxon['left_value'], $taxon['right_value'])->fetchAll();

        return $this->responder->success($names);
    }
}
