<?php declare(strict_types=1);

namespace App\Http\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use FastRoute\Dispatcher;

final class FastRouteMiddleware implements MiddlewareInterface
{
    private ResponseFactoryInterface $factory;

    private Dispatcher $dispatcher;

    private string $attribute;

    public function __construct(ResponseFactoryInterface $factory, Dispatcher $dispatcher, string $attribute = 'route::attributes')
    {
        $this->factory = $factory;
        $this->dispatcher = $dispatcher;
        $this->attribute = $attribute;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $info = $this->dispatcher->dispatch(
            $request->getMethod(),
            $request->getUri()->getPath(),
        );

        $status = array_shift($info);

        if ($status == Dispatcher::FOUND) {
            return $this->found($request, ...$info);
        }

        if ($status == Dispatcher::METHOD_NOT_ALLOWED) {
            return $this->methodNotAllowed($request, ...$info);
        }

        return $handler->handle($request);
    }

    /**
     * @param mixed $factory
     */
    private function found(ServerRequestInterface $request, $factory, array $attributes): ResponseInterface
    {
        if (! is_callable($factory)) {
            throw new \LogicException(
                vsprintf('Route handler must be a callable, %s given', [
                    gettype($factory),
                ])
            );
        }

        $handler = $factory();

        if (! $handler instanceof RequestHandlerInterface) {
            throw new \LogicException(
                vsprintf('Route handler must return an implementation of %s, %s returned', [
                    RequestHandlerInterface::class,
                    gettype($handler),
                ])
            );
        }

        return $handler->handle(
            $request->withAttribute($this->attribute, $attributes),
        );
    }

    private function methodNotAllowed(ServerRequestInterface $request, array $allowed): ResponseInterface
    {
        $response = $this->factory
            ->createResponse(405)
            ->withHeader('content-type', 'application/json');

        $response->getBody()->write((string) json_encode([
            'code' => 405,
            'success' => false,
            'reason' => vsprintf('Method %s not allowed for path %s (only [%s] allowed)', [
                $request->getMethod(),
                $request->getUri()->getPath(),
                implode(', ', $allowed)
            ]),
            'data' => [],
        ]));

        return $response;
    }
}
