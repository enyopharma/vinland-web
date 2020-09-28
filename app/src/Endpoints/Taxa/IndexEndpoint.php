<?php

declare(strict_types=1);

namespace App\Endpoints\Taxa;

use App\ReadModel\TaxonViewInterface;

final class IndexEndpoint
{
    private TaxonViewInterface $taxa;

    public function __construct(TaxonViewInterface $taxa)
    {
        $this->taxa = $taxa;
    }

    /**
     * @return iterable
     */
    public function __invoke(callable $input)
    {
        $query = $input('query', '');
        $limit = (int) $input('limit', 5);

        return $this->taxa->search($query, $limit);
    }
}
