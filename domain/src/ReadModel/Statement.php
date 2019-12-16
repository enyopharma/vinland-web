<?php

declare(strict_types=1);

namespace Domain\ReadModel;

/**
 * @implements \IteratorAggregate<int, array>
 */
final class Statement implements \IteratorAggregate
{
    private int $i;

    private \Iterator $iterator;

    public static function from(iterable $iterable): self
    {
        if ($iterable instanceof \Iterator) {
            return new self($iterable);
        }

        if (is_array($iterable)) {
            return new self(new \ArrayIterator($iterable));
        }

        return new self(new \IteratorIterator($iterable));
    }

    private function __construct(\Iterator $iterator)
    {
        $this->i = 0;
        $this->iterator = $iterator;
    }

    /**
     * @return array|false
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
