<?php

declare(strict_types=1);

namespace App\Endpoints\Proteins\Isoforms\Interactions;

use App\ReadModel\EdgeViewInterface;

final class IndexEndpoint
{
    private EdgeViewInterface $edges;

    public function __construct(EdgeViewInterface $edges)
    {
        $this->edges = $edges;
    }

    /**
     * @return iterable|false
     */
    public function __invoke(callable $input)
    {
        $protein_id = (int) $input('protein_id');
        $isoform_id = (int) $input('isoform_id');
        $type = $input('type');

        if ($type == 'hh' || $type == 'vh') {
            return $this->edges->protein($type, $protein_id, $isoform_id);
        }

        return false;
    }
}
