<?php

declare(strict_types=1);

namespace App\Endpoints\Isoforms;

use App\ReadModel\ProteinViewInterface;
use App\ReadModel\IsoformViewInterface;

final class ShowEndpoint
{
    public function __construct(
        private ProteinViewInterface $proteins,
        private IsoformViewInterface $isoforms,
    ) {}

    public function __invoke(callable $input): array|false
    {
        $protein_id = (int) $input('protein_id');
        $isoform_id = (int) $input('isoform_id');

        return $this->proteins->id($protein_id)->fetch()
            ? $this->isoforms->id($protein_id, $isoform_id)->fetch()
            : false;
    }
}
