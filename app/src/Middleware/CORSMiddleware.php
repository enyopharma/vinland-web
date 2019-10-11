<?php declare(strict_types=1);

namespace App\Http\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

final class CORSMiddleware implements MiddlewareInterface
{
    private $factory;

    private $domain;

    private $methods;

    public function __construct(ResponseFactoryInterface $factory, string $domain, string ...$methods)
    {
        $this->factory = $factory;
        $this->domain = $domain;
        $this->methods = $methods;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = strtoupper($request->getMethod()) == 'OPTIONS'
            ? $this->factory->createResponse(200)
            : $handler->handle($request);

        return $response
            ->withHeader('Access-Control-Allow-Origin', $this->domain)
            ->withHeader('Access-Control-Allow-Methods', implode(', ', $this->methods))
            ->withHeader('Access-Control-Allow-Headers', 'content-type')
            ;
    }
}
