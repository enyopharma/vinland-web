<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Quanta\Validation\Error;
use Quanta\Validation\InvalidDataException;

final class InputValidationMiddleware implements MiddlewareInterface
{
    /**
     * @var callable(array $data): mixed
     */
    private $validation;

    public function __construct(
        private ResponseFactoryInterface $factory,
        callable $validation,
        private string $attribute = 'input',
    ) {
        $this->validation = $validation;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $input = (array) $request->getParsedBody();

        try {
            $value = ($this->validation)($input);
        }

        catch (InvalidDataException $e) {
            return $this->failure(...$e->errors());
        }

        $request = $request->withAttribute($this->attribute, $value);

        return $handler->handle($request);
    }

    private function failure(Error ...$errors): ResponseInterface
    {
        $data = [
            'code' => 422,
            'success' => false,
            'data' => [],
            'errors' => array_map([$this, 'message'], $errors),
        ];

        $body = json_encode($data, JSON_THROW_ON_ERROR);

        $response = $this->factory
            ->createResponse(422)
            ->withHeader('content-type', 'application/json');

        $response->getBody()->write($body);

        return $response;
    }

    private function message(Error $error): string
    {
        $keys = array_map(fn ($key) => '[' . $key . ']', $error->keys());

        $name = implode('', $keys);

        return count($keys) == 0
            ? $error->message()
            : sprintf('%s => %s', $name, $error->message());
    }
}
