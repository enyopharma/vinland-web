<?php

declare(strict_types=1);

namespace App\Endpoints\Proteins;

use Psr\Http\Message\ServerRequestInterface;

use App\ReadModel\ProteinViewInterface;

final class IndexEndpoint
{
    private ProteinViewInterface $proteins;

    public function __construct(ProteinViewInterface $proteins)
    {
        $this->proteins = $proteins;
    }

    /**
     * @return iterable
     */
    public function __invoke(ServerRequestInterface $request)
    {
        $params = (array) $request->getQueryParams();

        $type = (string) ($params['type'] ?? '');
        $query = (string) ($params['query'] ?? '');
        $limit = (int) ($params['limit'] ?? 20);

        return $this->proteins->search($type, $query, $limit);
    }
}
