<?php

declare(strict_types=1);

namespace App\Endpoints\Interactions;

use App\ReadModel\InteractionViewInterface;

final class ShowEndpoint
{
    private InteractionViewInterface $interactions;

    public function __construct(InteractionViewInterface $interactions)
    {
        $this->interactions = $interactions;
    }

    /**
     * @return false|array
     */
    public function __invoke(callable $input, callable $responder)
    {
        $interaction_id = (int) $input('interaction_id');

        return $this->interactions->id($interaction_id)->fetch();
    }
}
