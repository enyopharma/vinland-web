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

    public function __invoke(callable $input): iterable|null
    {
        $interaction_id = (int) $input('interaction_id');

        if (!$this->interactions->id($interaction_id)->fetch()) {
            return null;
        }

        return $this->descriptions->all($interaction_id);
    }
}
