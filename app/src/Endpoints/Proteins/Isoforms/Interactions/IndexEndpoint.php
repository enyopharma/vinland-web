<?php

declare(strict_types=1);

namespace App\Endpoints\Proteins\Isoforms\Interactions;

use App\ReadModel\Isoforms\InteractionViewInterface;

final class IndexEndpoint
{
    private InteractionViewInterface $interactions;

    public function __construct(InteractionViewInterface $interactions)
    {
        $this->interactions = $interactions;
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
            return $this->interactions->isoform($type, $protein_id, $isoform_id);
        }

        return false;
    }
}
