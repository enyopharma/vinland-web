<?php

declare(strict_types=1);

namespace App\ReadModel;

interface AnnotationViewInterface
{
    /**
     * @return \App\ReadModel\Statement<\App\ReadModel\EntityInterface>
     */
    public function all(string $source, string $query, int $limit): Statement;
}
