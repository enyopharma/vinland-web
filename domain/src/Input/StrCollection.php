<?php

declare(strict_types=1);

namespace Domain\Input;

final class StrCollection
{
    private $strs;

    public function __construct(string ...$strs)
    {
        $this->strs = $strs;
    }

    public function count(): int
    {
        return count($this->strs);
    }

    public function values(): array
    {
        return $this->strs;
    }
}
