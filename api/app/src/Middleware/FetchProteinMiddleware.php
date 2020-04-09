<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use App\ReadModel\ProteinInterface;
use App\ReadModel\ProteinViewInterface;

final class FetchProteinMiddleware implements MiddlewareInterface
{
    private ResponseFactoryInterface $factory;

    private ProteinViewInterface $proteins;

    public function __construct(ResponseFactoryInterface $factory, ProteinViewInterface $proteins)
    {
        $this->factory = $factory;
        $this->proteins = $proteins;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $protein_id = (int) $request->getAttribute('protein_id');

        $select_protein_sth = $this->proteins->id($protein_id);

        if (! $protein = $select_protein_sth->fetch()) {
            return $this->factory->createResponse(404);
        }

        $request = $request->withAttribute(ProteinInterface::class, $protein);

        return $handler->handle($request);
    }
}
