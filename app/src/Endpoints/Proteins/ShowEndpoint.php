<?php

declare(strict_types=1);

namespace App\Endpoints\Proteins;

use App\ReadModel\ProteinViewInterface;

final class ShowEndpoint
{
    private ProteinViewInterface $proteins;

    public function __construct(ProteinViewInterface $proteins)
    {
        $this->proteins = $proteins;
    }

    /**
     * @return false|array
     */
    public function __invoke(callable $input)
    {
        $protein_id = (int) $input('protein_id');

        return $this->proteins->id($protein_id)->fetch();
    }
}
