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

        return is_null($isoform_id)
            ? $this->canonical($type, $protein_id)
            : $this->isoform($type, $protein_id, (int) $isoform_id);
    }

    /**
     * @return false|iterable
     */
    private function canonical(string $type, int $protein_id)
    {
        if (!$canonical = $this->isoforms->canonical($protein_id)->fetch()) {
            return false;
        }

        return $this->interactors->all($type, $protein_id, $canonical['id']);
    }

    /**
     * @return false|iterable
     */
    private function isoform(string $type, int $protein_id, int $isoform_id)
    {
        if (!$this->isoforms->id($protein_id, $isoform_id)->fetch()) {
            return false;
        }

        return $this->interactors->all($type, $protein_id, $isoform_id);
    }
}
