<?php

declare(strict_types=1);

namespace Domain\Validations;

final class SanitizeStrs
{
    public function __invoke(string ...$strs): array
    {
        $strs = array_map('trim', $strs);
        $strs = array_unique($strs);
        $strs = array_filter($strs, fn ($str) => ! empty($str));

        return $strs;
    }
}
