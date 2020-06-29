<?php

declare(strict_types=1);

namespace App\Endpoints\Taxa;

use Psr\Http\Message\ServerRequestInterface;

use App\ReadModel\TaxonViewInterface;

final class IndexEndpoint
{
    private TaxonViewInterface $taxa;

    public function __construct(TaxonViewInterface $taxa)
    {
        $this->taxa = $taxa;
    }

    /**
     * @return iterable
     */
    public function __invoke(ServerRequestInterface $request)
    {
        $params = (array) $request->getQueryParams();

        $query = (string) ($params['query'] ?? '');
        $limit = (int) ($params['limit'] ?? 5);

        return $this->taxa->search($query, $limit);
    }
}
