<?php

declare(strict_types=1);

namespace App\Endpoints\Mappings;

use App\ReadModel\ProteinViewInterface;
use App\ReadModel\MappingViewInterface;

final class IndexEndpoint
{
    public function __construct(
        private ProteinViewInterface $proteins,
        private MappingViewInterface $features,
    ) {
    }

    public function __invoke(callable $input): iterable|null
    {
        $protein_id = (int) $input('protein_id');
        $length = (int) $input('length', 0);

        if (!$this->proteins->id($protein_id)->fetch()) {
            return null;
        }

        return $this->features->targeting($protein_id, $length);
    }
}
