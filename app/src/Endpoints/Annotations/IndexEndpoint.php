<?php

declare(strict_types=1);

namespace App\Endpoints\Annotations;

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
    public function __invoke(callable $input)
    {
        $source = $input('source', '');
        $query = $input('query', '');
        $limit = (int) $input('limit', 5);

        return $this->annotations->all($source, $query, $limit);
    }
}
