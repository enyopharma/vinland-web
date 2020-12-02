<?php

declare(strict_types=1);

namespace App\Endpoints\Proteins;

use App\ReadModel\ProteinViewInterface;

final class IndexEndpoint
{
    public function __construct(
        private ProteinViewInterface $proteins,
    ) {}

    public function __invoke(callable $input): iterable
    {
        $type = $input('type', '');
        $query = $input('query', '');
        $limit = (int) $input('limit', 20);

        return $this->proteins->all($type, $query, $limit);
    }
}
