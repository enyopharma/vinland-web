<?php

declare(strict_types=1);

namespace App\Handlers;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use App\Handlers\Responder;

final class Endpoint implements RequestHandlerInterface
{
    /**
     * @var \App\Handlers\Responder
     */
    private Responder $responder;

    /**
     * @var callable(ServerRequestInterface, \App\Handlers\Responder): mixed
     */
    private $action;

    /**
     * @var string
     */
    private $key;

    /**
     * @var array
     */
    private $metadata;

    /**
     * @param \App\Handlers\Responder                                           $responder
     * @param callable(ServerRequestInterface, \App\Handlers\Responder): mixed  $action
     * @param string                                                            $key
     * @param array                                                             $metadata
     */
    public function __construct(
        Responder $responder,
        callable $action,
        string $key = 'data',
        array $metadata = []
    ) {
        $this->responder = $responder;
        $this->action = $action;
        $this->key = $key;
        $this->metadata = $metadata;
    }

    /**
     * @inheritdoc
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $result = ($this->action)($request, $this->responder);

        if (is_null($result)) {
            return ($this->responder)(200);
        }

        if ($result === false) {
            return ($this->responder)(404);
        }

        if (is_string($result)) {
            return ($this->responder)(200, $result);
        }

        if ($result instanceof ResponseInterface) {
            return $result;
        }

        $data = array_merge($this->metadata, [
            $this->key => $result instanceof \Traversable
                ? iterator_to_array($result)
                : $result,
        ]);

        return ($this->responder)(200, $data);
    }
}
