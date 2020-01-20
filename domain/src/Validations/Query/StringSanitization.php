<?php

declare(strict_types=1);

namespace Domain\Validations\Query;

use Quanta\Validation\Success;
use Quanta\Validation\InputInterface;

final class StringSanitization
{
    private bool $upper;

    public static function forceUpper(bool $upper): self
    {
        return new self($upper);
    }

    public function __construct(bool $upper = false)
    {
        $this->upper = $upper;
    }

    public function __invoke(array $strs): InputInterface
    {
        if ($this->upper) {
            $strs = array_map('strtoupper', $strs);
        }

        $strs = array_map('trim', $strs);
        $strs = array_unique($strs);
        $strs = array_filter($strs, fn ($str) => strlen($str) > 0);

        return new Success($strs);
    }
}
