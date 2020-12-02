<?php

declare(strict_types=1);

namespace App\ReadModel;

/**
 * @implements \IteratorAggregate<array>
 */
final class Statement implements \IteratorAggregate
{
    private int $i;

    /**
     * @param iterable<array> $iterable
     */
    public static function from(iterable $iterable): self
    {
        if (is_array($iterable)) {
            return new self(new \ArrayIterator($iterable));
        }

        if ($iterable instanceof \Iterator) {
            return new self($iterable);
        }

        return new self(new \IteratorIterator($iterable));
    }

    /**
     * @param \Iterator<array> $iterator
     */
    private function __construct(
        private \Iterator $iterator,
    ) {
        $this->i = 0;
    }

    /**
     * @return array|false phpstan bug :/
     */
    public function fetch()
    {
        $this->i == 0
            ? $this->iterator->rewind()
            : $this->iterator->next();

        if ($this->iterator->valid()) {
            $this->i++;

            return $this->iterator->current();
        }

        return false;
    }

    public function fetchAll(): array
    {
        return iterator_to_array($this->iterator);
    }

    public function getIterator()
    {
        return $this->iterator;
    }
}
