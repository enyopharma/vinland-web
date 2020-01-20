<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Quanta\Validation\ErrorInterface;

final class InputValidationMiddleware implements MiddlewareInterface
{
    private ResponseFactoryInterface $factory;

    /**
     * @var callable(array $data): \Quanta\Validation\InputInterface
     */
    private $validation;

    public function __construct(ResponseFactoryInterface $factory, callable $validation)
    {
        $this->factory = $factory;
        $this->validation = $validation;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $input = (array) $request->getParsedBody();

        return ($this->validation)($input)->extract(
            fn ($input) => $this->success($request, $handler, $input),
            fn (...$xs) => $this->failure(...$xs),
        );
    }

    /**
     * @param mixed $input
     */
    private function success(ServerRequestInterface $request, RequestHandlerInterface $handler, $input): ResponseInterface
    {
        $name = $this->inputAttributeName($input);

        $request = $request->withAttribute($name, $input);

        return $handler->handle($request);
    }

    private function failure(ErrorInterface ...$errors): ResponseInterface
    {
        $response = $this->factory->createResponse(422);

        $contents = json_encode([
            'success' => false,
            'code' => 422,
            'data' => [],
            'errors' => array_map([$this, 'message'], $errors),
        ]);

        if (! $contents) {
            throw new \Exception(json_last_error_msg());
        }

        $response->getBody()->write($contents);

        return $response->withHeader('content-type', 'application/json');
    }

    /**
     * @param mixed $input
     */
    private function inputAttributeName($input): string
    {
        if (! is_object($input)) {
            return 'input';
        }

        $class = get_class($input);

        return strpos($class, '@anonymous') === false ? $class : 'input';
    }

    private function message(ErrorInterface $error): string
    {
        $name = $error->name();

        return $name == ''
            ? $error->message()
            : sprintf('%s => %s', $error->name(), $error->message());
    }
}
