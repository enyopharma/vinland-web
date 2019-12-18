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

    private string $attributes;

    public function __construct(ResponseFactoryInterface $factory, Dispatcher $dispatcher, string $attributes = 'route::attributes')
    {
        $this->factory = $factory;
        $this->dispatcher = $dispatcher;
        $this->attributes = $attributes;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $info = $this->dispatcher->dispatch(
            $request->getMethod(),
            $request->getUri()->getPath(),
        );

        $status = array_shift($info);

        if ($status == Dispatcher::NOT_FOUND) {
            return $this->factory->createResponse(404);
        }

        if ($status == Dispatcher::METHOD_NOT_ALLOWED) {
            return $this->factory->createResponse(405)->withHeader('Allow', implode(', ', $info[0]));
        }

        [$factory, $attributes] = $info;

        if (! is_callable($factory)) {
            throw new \LogicException(
                sprintf('Route handler must be a callable, %s given', gettype($factory)),
            );
        }

        $request = $request
            ->withAttribute(RequesthandlerInterface::class, $factory())
            ->withAttribute($this->attributes, $attributes);

        return $handler->handle($request);
    }
}
