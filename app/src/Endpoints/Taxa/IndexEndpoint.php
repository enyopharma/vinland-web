<?php

declare(strict_types=1);

namespace App\Endpoints\Taxa;

use App\ReadModel\TaxonViewInterface;

final class IndexEndpoint
{
    public function __construct(
        private TaxonViewInterface $taxa,
    ) {}

    public function __invoke(callable $input): iterable
    {
        $query = $input('query', '');
        $limit = (int) $input('limit', 5);

        return $this->taxa->search($query, $limit);
    }
}
