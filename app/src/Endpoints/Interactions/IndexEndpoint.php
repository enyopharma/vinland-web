<?php

declare(strict_types=1);

namespace App\Endpoints\Interactions;

use Psr\Http\Message\ResponseInterface;

use App\Input\InteractionQueryInput;
use App\ReadModel\InteractionViewInterface;

final class IndexEndpoint
{
    const INCOMPLETE = 'incomplete';
    const SUCCESS = 'success';

    public function __construct(
        private InteractionViewInterface $interactions,
    ) {}

    public function __invoke(callable $input, callable $responder): ResponseInterface
    {
        $query = $input('input');

        if (!$query instanceof InteractionQueryInput) {
            throw new \LogicException;
        }

        $complete = $query->isComplete();

        $data = [
            'code' => 200,
            'success' => true,
            'status' => $complete ? self::SUCCESS : self:: INCOMPLETE,
            'data' => $complete
                ? $this->interactions->all($query)->fetchAll()
                : [],
        ];

        $contents = json_encode($data, JSON_THROW_ON_ERROR);

        $response = $responder(200)->withHeader('content-type', 'application/json');

        $response->getBody()->write($contents);

        return $response;
    }
}
