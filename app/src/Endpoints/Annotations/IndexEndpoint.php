<?php

declare(strict_types=1);

namespace App\Endpoints\Annotations;

use App\ReadModel\AnnotationViewInterface;

final class IndexEndpoint
{
    public function __construct(
        private AnnotationViewInterface $annotations
    ) {}

    public function __invoke(callable $input): iterable
    {
        $source = $input('source', '');
        $query = $input('query', '');
        $limit = (int) $input('limit', 5);

        return $this->annotations->all($source, $query, $limit);
    }
}
