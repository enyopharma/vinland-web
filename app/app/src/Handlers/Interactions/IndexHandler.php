<?php

declare(strict_types=1);

namespace App\Http\Handlers\Interactions;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use Quanta\Validation\ErrorInterface;

use Domain\Input\QueryInput;
use Domain\ReadModel\InteractionViewInterface;

use App\Http\Responders\JsonResponder;

final class IndexHandler implements RequestHandlerInterface
{
    const INCOMPLETE = 'incomplete';
    const SUCCESS = 'success';

    private JsonResponder $responder;

    private InteractionViewInterface $interactions;

    public function __construct(JsonResponder $responder, InteractionViewInterface $interactions)
    {
        $this->responder = $responder;
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
            return $this->responder->success([], ['status' => self::INCOMPLETE]);
        }

        $interactions = $this->interactions->all($input)->fetchAll();

        return $this->responder->success($interactions, ['status' => self::SUCCESS]);
    }
}
