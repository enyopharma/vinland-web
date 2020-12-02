<?php

declare(strict_types=1);

namespace App\Endpoints\Interactions;

use App\ReadModel\InteractionViewInterface;

final class ShowEndpoint
{
    public function __construct(
        private InteractionViewInterface $interactions,
    ) {}

    public function __invoke(callable $input, callable $responder): array|false
    {
        $interaction_id = (int) $input('interaction_id');

        return $this->interactions->id($interaction_id)->fetch();
    }
}
