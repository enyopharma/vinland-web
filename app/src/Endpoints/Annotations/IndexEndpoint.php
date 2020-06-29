<?php

declare(strict_types=1);

namespace App\Endpoints\Annotations;

use Psr\Http\Message\ServerRequestInterface;

use App\ReadModel\AnnotationViewInterface;

final class IndexEndpoint
{
    private AnnotationViewInterface $annotations;

    public function __construct(AnnotationViewInterface $annotations)
    {
        $this->annotations = $annotations;
    }

    /**
     * @return iterable
     */
    public function __invoke(ServerRequestInterface $request)
    {
        $params = (array) $request->getQueryParams();

        $source = (string) ($params['source'] ?? '');
        $query = (string) ($params['query'] ?? '');
        $limit = (int) ($params['limit'] ?? 5);

        return $this->annotations->all($source, $query, $limit);
    }
}
