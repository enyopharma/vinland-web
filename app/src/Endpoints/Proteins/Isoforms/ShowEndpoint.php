<?php

declare(strict_types=1);

namespace App\Endpoints\Proteins\Isoforms;

use Psr\Http\Message\ServerRequestInterface;

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
    public function __invoke(ServerRequestInterface $request)
    {
        $protein_id = (int) $request->getAttribute('protein_id');
        $isoform_id = (int) $request->getAttribute('isoform_id');

        return $this->isoforms->id($protein_id, $isoform_id, 'interactions')->fetch();
    }
}
