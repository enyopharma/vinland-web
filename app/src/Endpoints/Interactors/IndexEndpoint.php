<?php

declare(strict_types=1);

namespace App\Endpoints\Interactors;

use App\ReadModel\ProteinViewInterface;
use App\ReadModel\IsoformViewInterface;
use App\ReadModel\InteractorViewInterface;

final class IndexEndpoint
{
    private ProteinViewInterface $proteins;

    private IsoformViewInterface $isoforms;

    private InteractorViewInterface $interactors;

    public function __construct(
        ProteinViewInterface $proteins,
        IsoformViewInterface $isoforms,
        InteractorViewInterface $interactors
    ) {
        $this->proteins = $proteins;
        $this->isoforms = $isoforms;
        $this->interactors = $interactors;
    }

    /**
     * @return false|iterable
     */
    public function __invoke(callable $input)
    {
        $type = $input('type');
        $protein_id = (int) $input('protein_id');
        $isoform_id = $input('isoform_id', null);

        if ($type != 'h' && $type != 'v') {
            return false;
        }

        if (!$this->proteins->id($protein_id)->fetch()) {
            return false;
        }

        $isoform = is_null($isoform_id)
            ? $this->isoforms->canonical($protein_id)->fetch()
            : $this->isoforms->id($protein_id, (int) $isoform_id)->fetch();

        if (!$isoform) {
            return false;
        }

        return $this->interactors->all($type, $protein_id, $isoform['id']);
    }
}
