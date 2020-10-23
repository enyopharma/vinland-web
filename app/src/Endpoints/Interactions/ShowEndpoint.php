<?php

declare(strict_types=1);

namespace App\Endpoints\Interactions;

use App\ReadModel\InteractionViewInterface;
use App\ReadModel\DescriptionViewInterface;

final class ShowEndpoint
{
    private InteractionViewInterface $interactions;

    private DescriptionViewInterface $descriptions;

    public function __construct(InteractionViewInterface $interactions, DescriptionViewInterface $descriptions)
    {
        $this->interactions = $interactions;
        $this->descriptions = $descriptions;
    }

    /**
     * @return false|iterable
     */
    public function __invoke(callable $input)
    {
        $interaction_id = (int) $input('interaction_id');

        $interaction = $this->interactions->id($interaction_id)->fetch();

        return $interaction
            ? $this->descriptions->all($interaction_id, 0, 0)
            : false;
    }
}
