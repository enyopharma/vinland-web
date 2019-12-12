<?php

declare(strict_types=1);

namespace App\Http\Handlers\Interactions;

use Psr\Http\Server\RequestHandlerInterface;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Quanta\Validation\ErrorInterface;

use Domain\Input\QueryInput;
use Domain\ReadModel\InteractionViewInterface;

use App\Http\Validations\RequestToQuery;

final class IndexHandler implements RequestHandlerInterface
{
    const INCOMPLETE = 'incomplete';
    const SUCCESS = 'success';
    const FAILURE = 'failure';

    private ResponseFactoryInterface $factory;

    private InteractionViewInterface $interactions;

    private RequestToQuery $validation;

    public function __construct(
        ResponseFactoryInterface $factory,
        InteractionViewInterface $interactions,
        RequestToQuery $validation
    ) {
        $this->factory = $factory;
        $this->interactions = $interactions;
        $this->validation = $validation;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return $this->validation->input($request)->extract(
            fn (...$xs) => $this->success(...$xs),
            fn (...$xs) => $this->failure(...$xs),
        );
    }

    private function success(QueryInput $query): ResponseInterface
    {
        if (! $query->isComplete()) {
            return $this->response(self::INCOMPLETE);
        }

        $interactions = $this->interactions->all($query)->fetchAll();

        return $this->response(self::SUCCESS, $interactions);
    }

    private function failure(ErrorInterface ...$errors): ResponseInterface
    {
        return $this->response(self::FAILURE, array_map([$this, 'message'], $errors));
    }

    private function message(ErrorInterface $error): string
    {
        return sprintf('%s => %s', $error->name() == '' ? '' : $error->name(), $error->message());
    }

    private function response(string $status, array $data = []): ResponseInterface
    {
        $success = [self::INCOMPLETE => true, self::SUCCESS => true, self::FAILURE => false];
        $code = [self::INCOMPLETE => 200, self::SUCCESS => 200, self::FAILURE => 422];

        $response = $this->factory->createResponse($code[$status]);

        $response->getBody()->write((string) json_encode([
            'success' => $success[$status],
            'code' => $code[$status],
            'status' => $status,
            'data' => $data,
        ]));

        return $response->withHeader('content-type', 'application/json');
    }
}
