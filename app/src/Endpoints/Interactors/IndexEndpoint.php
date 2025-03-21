<?php

declare(strict_types=1);

namespace App\Endpoints\Interactors;

use App\ReadModel\ProteinViewInterface;
use App\ReadModel\IsoformViewInterface;
use App\ReadModel\InteractorViewInterface;

final class IndexEndpoint
{
    public function __construct(
        private ProteinViewInterface $proteins,
        private InteractorViewInterface $interactors,
    ) {}

    public function __invoke(callable $input): iterable|null
    {
        $type = $input('type');
        $protein_id = (int) $input('protein_id');

        if ($type != 'h' && $type != 'v') {
            return null;
        }

        if (!$this->proteins->id($protein_id)->fetch()) {
            return null;
        }

        return $this->interactors->all($type, $protein_id);
    }
}
