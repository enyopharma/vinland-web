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

    public function __invoke(callable $input, callable $responder): ResponseInterface|iterable
    {
        $query = $input('input');

        if (!$query instanceof InteractionQueryInput) {
            throw new \LogicException;
        }

        $complete = $query->isComplete();

        $body = [
            'code' => 200,
            'success' => true,
            'status' => $complete ? self::SUCCESS : self:: INCOMPLETE,
        ];

        if ($complete) {
            $body['data'] = $this->interactions->all($query)->fetchAll();
        }

        return $responder(200, $body);
    }
}
