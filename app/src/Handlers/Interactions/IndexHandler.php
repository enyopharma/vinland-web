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

    private ResponseFactoryInterface $factory;

    private InteractionViewInterface $interactions;

    public function __construct(ResponseFactoryInterface $factory, InteractionViewInterface $interactions)
    {
        $this->factory = $factory;
        $this->interactions = $interactions;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        if (is_null($input = $request->getAttribute(\Domain\Input\QueryInput::class))) {
            throw new \LogicException;
        }

        if (! $input instanceof \Domain\Input\QueryInput) {
            throw new \LogicException;
        }

        if (! $input->isComplete()) {
            return $this->response(self::INCOMPLETE);
        }

        $interactions = $this->interactions->all($input)->fetchAll();

        return $this->response(self::SUCCESS, $interactions);
    }

    private function response(string $status, array $data = []): ResponseInterface
    {
        $response = $this->factory->createResponse(200);

        $response->getBody()->write((string) json_encode([
            'success' => true,
            'code' => 200,
            'status' => $status,
            'data' => $data,
        ]));

        return $response->withHeader('content-type', 'application/json');
    }
}
