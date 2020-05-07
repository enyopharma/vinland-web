<?php

declare(strict_types=1);

namespace App\Handlers\Interactions;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use Quanta\Validation\ErrorInterface;

use App\Request\QueryInput;
use App\Responders\JsonResponder;
use App\ReadModel\InteractionViewInterface;

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
        $input = $request->getAttribute(\App\Request\QueryInput::class);

        if (! $input instanceof \App\Request\QueryInput) {
            throw new \LogicException;
        }

        if (! $input->isComplete()) {
            return $this->responder->success([], ['status' => self::INCOMPLETE]);
        }

        $interactions = $this->interactions->all($input)->fetchAll();

        return $this->responder->success($interactions, ['status' => self::SUCCESS]);
    }
}
