<?php

declare(strict_types=1);

namespace App\Endpoints\Interactors;

use App\ReadModel\ProteinViewInterface;
use App\ReadModel\IsoformViewInterface;
use App\ReadModel\InteractorViewInterface;

final class IndexEndpoint
{
    private ProteinViewInterface $proteins;

    private InteractorViewInterface $interactors;

    public function __construct(ProteinViewInterface $proteins, InteractorViewInterface $interactors)
    {
        $this->proteins = $proteins;
        $this->interactors = $interactors;
    }

    /**
     * @return false|iterable
     */
    public function __invoke(callable $input)
    {
        $type = $input('type');
        $protein_id = (int) $input('protein_id');

        if ($type != 'h' && $type != 'v') {
            return false;
        }

        return $this->proteins->id($protein_id)->fetch()
            ? $this->interactors->all($type, $protein_id)
            : false;
    }
}
