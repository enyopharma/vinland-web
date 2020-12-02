<?php

declare(strict_types=1);

namespace App\Endpoints\Proteins;

use App\ReadModel\ProteinViewInterface;

final class ShowEndpoint
{
    public function __construct(
        private ProteinViewInterface $proteins,
    ) {}

    public function __invoke(callable $input): array|false
    {
        $protein_id = (int) $input('protein_id');

        return $this->proteins->id($protein_id)->fetch();
    }
}
