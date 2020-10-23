<?php

declare(strict_types=1);

namespace App\Endpoints\Proteins;

use App\ReadModel\ProteinViewInterface;

final class IndexEndpoint
{
    private ProteinViewInterface $proteins;

    public function __construct(ProteinViewInterface $proteins)
    {
        $this->proteins = $proteins;
    }

    /**
     * @return iterable
     */
    public function __invoke(callable $input)
    {
        $type = $input('type', '');
        $query = $input('query', '');
        $limit = (int) $input('limit', 20);

        return $this->proteins->all($type, $query, $limit);
    }
}
