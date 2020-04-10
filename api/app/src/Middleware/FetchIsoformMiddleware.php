<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use App\ReadModel\ProteinInterface;
use App\ReadModel\IsoformInterface;

final class FetchIsoformMiddleware implements MiddlewareInterface
{
    private ResponseFactoryInterface $factory;

    public function __construct(ResponseFactoryInterface $factory)
    {
        $this->factory = $factory;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $protein = $request->getAttribute(ProteinInterface::class);

        if (! $protein instanceof ProteinInterface) {
            throw new \LogicException;
        }

        $attributes = (array) $request->getAttributes();

        $isoform_id = (int) ($attributes['isoform_id'] ?? 0);

        $isoforms = $protein->isoforms();

        $isoform = $isoforms->id($isoform_id)->fetch();

        if (! $isoform) {
            return $this->factory->createResponse(404);
        }

        $request = $request->withAttribute(IsoformInterface::class, $isoform);

        return $handler->handle($request);
    }
}
