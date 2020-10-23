<?php

declare(strict_types=1);

namespace App\Endpoints\Isoforms;

use App\ReadModel\ProteinViewInterface;
use App\ReadModel\IsoformViewInterface;

final class IndexEndpoint
{
    private ProteinViewInterface $proteins;

    private IsoformViewInterface $isoforms;

    public function __construct(ProteinViewInterface $proteins, IsoformViewInterface $isoforms)
    {
        $this->proteins = $proteins;
        $this->isoforms = $isoforms;
    }

    /**
     * @return false|iterable
     */
    public function __invoke(callable $input)
    {
        $protein_id = (int) $input('protein_id');

        return $this->proteins->id($protein_id)->fetch()
            ? $this->isoforms->all($protein_id)
            : false;
    }
}
