<?php

declare(strict_types=1);

namespace App\Endpoints\Stats;

use App\ReadModel\StatViewInterface;

final class IndexEndpoint
{
    public function __construct(
        private StatViewInterface $stats,
    ) {
    }

    public function __invoke(): iterable
    {
        return $this->stats->all()->fetch();
    }
}
