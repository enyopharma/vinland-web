<?php

declare(strict_types=1);

namespace App\ReadModel;

interface AnnotationViewInterface
{
    public function all(string $source, string $query, int $limit): Statement;
}
