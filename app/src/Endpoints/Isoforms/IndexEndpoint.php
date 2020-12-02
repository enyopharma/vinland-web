<?php

declare(strict_types=1);

namespace App\Endpoints\Isoforms;

use App\ReadModel\ProteinViewInterface;
use App\ReadModel\IsoformViewInterface;

final class IndexEndpoint
{
    public function __construct(
        private ProteinViewInterface $proteins,
        private IsoformViewInterface $isoforms,
    ) {}

    public function __invoke(callable $input): iterable|false
    {
        $protein_id = (int) $input('protein_id');

        return $this->proteins->id($protein_id)->fetch()
            ? $this->isoforms->all($protein_id)
            : false;
    }
}
