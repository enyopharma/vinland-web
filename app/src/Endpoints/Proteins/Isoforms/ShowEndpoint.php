<?php

declare(strict_types=1);

namespace App\Endpoints\Proteins\Isoforms;

use App\ReadModel\IsoformViewInterface;

final class ShowEndpoint
{
    private IsoformViewInterface $isoforms;

    public function __construct(IsoformViewInterface $isoforms)
    {
        $this->isoforms = $isoforms;
    }

    /**
     * @return false|array
     */
    public function __invoke(callable $input)
    {
        $protein_id = (int) $input('protein_id');
        $isoform_id = (int) $input('isoform_id');

        return $this->isoforms->id($protein_id, $isoform_id)->fetch();
    }
}
