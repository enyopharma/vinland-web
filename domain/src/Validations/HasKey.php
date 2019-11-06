<?php

declare(strict_types=1);

namespace Domain\Validations;

use Quanta\Validation\Error;
use Quanta\Validation\Success;
use Quanta\Validation\Failure;
use Quanta\Validation\InputInterface;

final class HasKey
{
    private $key;

    public function __construct(string $key)
    {
        $this->key = $key;
    }

    public function __invoke(array $data): InputInterface
    {
        return key_exists($this->key, $data)
            ? Success::named($this->key, $data[$this->key])
            : Failure::named($this->key, new Error('%%s is required'));
    }
}
