<?php

declare(strict_types=1);

namespace App\Http\Handlers\Taxa;

use Psr\Http\Server\RequestHandlerInterface;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Domain\ReadModel\TaxaViewInterface;

final class IndexHandler implements RequestHandlerInterface
{
    private $factory;

    private $taxa;

    public function __construct(ResponseFactoryInterface $factory, TaxaViewInterface $taxa)
    {
        $this->factory = $factory;
        $this->taxa = $taxa;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $params = (array) $request->getQueryParams();

        $q = (string) ($params['q'] ?? '');
        $limit = (int) ($params['limit'] ?? 5);

        $taxa = $this->taxa->all($q, $limit);

        $response = $this->factory->createResponse(200);

        $response->getBody()->write(json_encode([
            'success' => true,
            'code' => 200,
            'data' => $taxa->fetchAll(),
        ]));

        return $response->withHeader('content-type', 'application/json');
    }
}
