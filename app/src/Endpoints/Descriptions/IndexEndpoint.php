<?php

declare(strict_types=1);

namespace App\Endpoints\Descriptions;

use App\ReadModel\InteractionViewInterface;
use App\ReadModel\DescriptionViewInterface;
use App\ReadModel\IsoformViewInterface;

final class IndexEndpoint
{
    public function __construct(
        private InteractionViewInterface $interactions,
        private DescriptionViewInterface $descriptions,
    ) {}

    public function __invoke(callable $input): iterable|false
    {
        $interaction_id = (int) $input('interaction_id');

        return $this->interactions->id($interaction_id)->fetch()
            ? $this->descriptions->all($interaction_id)
            : false;
    }
}
