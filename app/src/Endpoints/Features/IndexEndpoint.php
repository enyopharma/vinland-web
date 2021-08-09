<?php

declare(strict_types=1);

namespace App\Endpoints\Features;

use App\ReadModel\ProteinViewInterface;
use App\ReadModel\IsoformViewInterface;
use App\ReadModel\FeatureViewInterface;

final class IndexEndpoint
{
    public function __construct(
        private ProteinViewInterface $proteins,
        private IsoformViewInterface $isoforms,
        private FeatureViewInterface $features,
    ) {
    }

    public function __invoke(callable $input): iterable|null
    {
        $protein_id = (int) $input('protein_id');
        $isoform_id = (int) $input('isoform_id');
        $types = array_values((array) $input('types', []));

        if (!$this->proteins->id($protein_id)->fetch()) {
            return null;
        }

        if (!$this->isoforms->id($protein_id, $isoform_id)->fetch()) {
            return null;
        }

        return $this->features->all($isoform_id, ...$types);
    }
}
