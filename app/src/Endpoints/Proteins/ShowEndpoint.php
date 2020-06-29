<?php

declare(strict_types=1);

namespace App\Endpoints\Proteins;

use Psr\Http\Message\ServerRequestInterface;

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
    public function __invoke(ServerRequestInterface $request)
    {
        $protein_id = (int) $request->getAttribute('protein_id');

        return $this->proteins->id($protein_id, 'isoforms')->fetch();
    }
}
