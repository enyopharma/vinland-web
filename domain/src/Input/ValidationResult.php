<?php

declare(strict_types=1);

namespace Domain\Input;

final class ValidationResult
{
    const SUCCESS = 0;
    const FAILURE = 1;

    private $type;

    private $data;

    private $errors;

    public static function success(array $data): self
    {
        return new self(self::SUCCESS, $data);
    }

    public static function failure(string ...$errors): self
    {
        return new self(self::FAILURE, [], ...$errors);
    }

    private function __construct(int $type, array $data, string ...$errors)
    {
        $this->type = $type;
        $this->data = $data;
        $this->errors = $errors;
    }

    public function isSuccess(): bool
    {
        return $this->type == self::SUCCESS;
    }

    public function isFailure(): bool
    {
        return $this->type == self::FAILURE;
    }

    public function data(): array
    {
        if ($this->isSuccess()) {
            return $this->data;
        }

        throw new \LogicException('Unable to get data from a validation failure');
    }

    public function errors(): array
    {
        if ($this->isFailure()) {
            return $this->errors;
        }

        throw new \LogicException('Unable to get errors from a validation success');
    }
}
