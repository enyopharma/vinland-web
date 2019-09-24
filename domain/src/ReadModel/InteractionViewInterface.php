<?php

declare(strict_types=1);

namespace Domain\ReadModel;

use Domain\Input\StrCollection;

interface InteractionViewInterface
{
    public function HHNetwork(StrCollection $accessions, int $publication, int $method): Statement;

    public function HHInteractions(StrCollection $accessions, int $publication, int $method): Statement;

    public function VHInteractions(
        StrCollection $accessions,
        int $left,
        int $right,
        StrCollection $names,
        int $publication,
        int $method
    ): Statement;
}
