<?php declare(strict_types=1);

namespace App\Http\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

final class CORSMiddleware implements MiddlewareInterface
{
    private ResponseFactoryInterface $factory;

    private array $methods;

    private array $allowed;

    public function __construct(ResponseFactoryInterface $factory, array $methods, string ...$allowed)
    {
        $this->factory = $factory;
        $this->methods = $methods;
        $this->allowed = $allowed;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = strtoupper($request->getMethod()) == 'OPTIONS'
            ? $this->factory->createResponse(200)
            : $handler->handle($request);

        $origin = $request->getHeaderLine('origin');

        return ! $this->isAllowed($origin) ? $response : $response
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Allow-Methods', implode(', ', $this->methods))
            ->withHeader('Access-Control-Allow-Headers', 'content-type');
    }

    private function isAllowed(string $origin): bool
    {
        return preg_match('/^https?:\/\/localhost/', $origin) === 1
            || in_array($origin, $this->allowed);
    }
}
