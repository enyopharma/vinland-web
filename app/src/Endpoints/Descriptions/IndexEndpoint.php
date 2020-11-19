<?php

declare(strict_types=1);

namespace App\Endpoints\Descriptions;

use App\ReadModel\InteractionViewInterface;
use App\ReadModel\DescriptionViewInterface;
use App\ReadModel\IsoformViewInterface;

final class IndexEndpoint
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

        return $this->interactions->id($interaction_id)->fetch()
            ? $this->descriptions->all($interaction_id)
            : false;
    }
}
