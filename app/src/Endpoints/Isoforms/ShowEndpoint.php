<?php

declare(strict_types=1);

namespace App\Endpoints\Isoforms;

use App\ReadModel\ProteinViewInterface;
use App\ReadModel\IsoformViewInterface;

final class ShowEndpoint
{
    private ProteinViewInterface $proteins;

    private IsoformViewInterface $isoforms;

    public function __construct(ProteinViewInterface $proteins, IsoformViewInterface $isoforms)
    {
        $this->proteins = $proteins;
        $this->isoforms = $isoforms;
    }
    /**
     * @return false|array
     */
    public function __invoke(callable $input)
    {
        $protein_id = (int) $input('protein_id');
        $isoform_id = (int) $input('isoform_id');

        return $this->proteins->id($protein_id)->fetch()
            ? $this->isoforms->id($protein_id, $isoform_id)->fetch()
            : false;
    }
}
