<?php

declare(strict_types=1);

namespace App\Handlers\Taxa;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use App\ReadModel\TaxonViewInterface;

use App\Responders\JsonResponder;

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
        $params = (array) $request->getQueryParams();

        $query = (string) ($params['query'] ?? '');
        $limit = (int) ($params['limit'] ?? 5);

        $taxa = $this->taxa->search($query, $limit)->fetchAll();

        return $this->responder->success($taxa);
    }
}
