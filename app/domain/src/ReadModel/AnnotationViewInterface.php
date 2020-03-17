<?php

declare(strict_types=1);

namespace Domain\ReadModel;

interface AnnotationViewInterface
{
    public function all(string $source, string $query, int $limit): Statement;
}
