<?php

declare(strict_types=1);

namespace App\Endpoints\Isoforms\Interactions;

use App\ReadModel\ProteinViewInterface;
use App\ReadModel\IsoformViewInterface;
use App\ReadModel\Isoforms\InteractionViewInterface;

final class IndexEndpoint
{
    private ProteinViewInterface $proteins;

    private IsoformViewInterface $isoforms;

    private InteractionViewInterface $interactions;

    public function __construct(
        ProteinViewInterface $proteins,
        IsoformViewInterface $isoforms,
        InteractionViewInterface $interactions
    ) {
        $this->proteins = $proteins;
        $this->isoforms = $isoforms;
        $this->interactions = $interactions;
    }

    /**
     * @return false|iterable
     */
    public function __invoke(callable $input)
    {
        $protein_id = (int) $input('protein_id');
        $isoform_id = (int) $input('isoform_id');
        $type = $input('type');

        if (!$this->proteins->id($protein_id)->fetch()) {
            return false;
        }

        if (!$this->isoforms->id($protein_id, $isoform_id)->fetch()) {
            return false;
        }

        if ($type == 'hh' || $type == 'vh') {
            return $this->interactions->isoform($type, $protein_id, $isoform_id);
        }

        return false;
    }
}
