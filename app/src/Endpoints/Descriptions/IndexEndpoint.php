<?php

declare(strict_types=1);

namespace App\Endpoints\Descriptions;

use App\ReadModel\InteractionViewInterface;
use App\ReadModel\DescriptionViewInterface;
use App\ReadModel\IsoformViewInterface;

final class IndexEndpoint
{
    private InteractionViewInterface $interactions;

    private DescriptionViewInterface $descriptions;

    private IsoformViewInterface $isoforms;

    public function __construct(InteractionViewInterface $interactions, DescriptionViewInterface $descriptions, IsoformViewInterface $isoforms)
    {
        $this->interactions = $interactions;
        $this->descriptions = $descriptions;
        $this->isoforms = $isoforms;
    }

    /**
     * @return false|iterable
     */
    public function __invoke(callable $input)
    {
        $interaction_id = (int) $input('interaction_id');
        $isoform1_id = $input('isoform1_id', null);
        $isoform2_id = $input('isoform2_id', null);

        if (!$interaction = $this->interactions->id($interaction_id)->fetch()) {
            return false;
        }

        $isoform1 = is_null($isoform1_id)
            ? $this->isoforms->canonical($interaction['protein1_id'])->fetch()
            : $this->isoforms->id($interaction['protein1_id'], (int) $isoform1_id)->fetch();

        if (!$isoform1) {
            return false;
        }

        $isoform2 = is_null($isoform2_id)
            ? $this->isoforms->canonical($interaction['protein2_id'])->fetch()
            : $this->isoforms->id($interaction['protein2_id'], (int) $isoform2_id)->fetch();

        if (!$isoform2) {
            return false;
        }

        return $this->descriptions->all($interaction_id, $isoform1['id'], $isoform2['id']);
    }
}
