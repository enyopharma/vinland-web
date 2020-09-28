<?php

declare(strict_types=1);

namespace App\Endpoints\Interactions;

use App\Input\InteractionQueryInput;
use App\ReadModel\InteractionViewInterface;

final class IndexEndpoint
{
    const INCOMPLETE = 'incomplete';
    const SUCCESS = 'success';

    private InteractionViewInterface $interactions;

    public function __construct(InteractionViewInterface $interactions)
    {
        $this->interactions = $interactions;
    }

    /**
     * @return iterable|\Psr\Http\Message\ResponseInterface
     */
    public function __invoke(callable $input, callable $responder)
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
