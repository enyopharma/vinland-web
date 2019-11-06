<?php

declare(strict_types=1);

namespace Domain\Validations;

use Quanta\Validation\Error;
use Quanta\Validation\Success;
use Quanta\Validation\Failure;
use Quanta\Validation\InputInterface;

final class IsTypedAs
{
    const MAP = [
        'bool' => ['boolean', '%%s must be a boolean'],
        'boolean' => ['boolean', '%%s must be a boolean'],
        'int' => ['integer', '%%s must be an integer'],
        'integer' => ['integer', '%%s must be an integer'],
        'float' => ['double', '%%s must be a float'],
        'double' => ['double', '%%s must be a float'],
        'string' => ['string', '%%s must be a string'],
        'array' => ['array', '%%s must be an array'],
        'resource' => ['resource', '%%s must be an resource'],
        'null' => ['null', '%%s must be null'],
    ];

    private $type;

    public function __construct(string $type)
    {
        $this->type = $type;
    }

    public function __invoke($value): InputInterface
    {
        $expected = strtolower($this->type);

        if (key_exists($expected, self::MAP)) {
            [$type, $message] = self::MAP[$expected];

            return strtolower(gettype($value)) == $type
                ? new Success($value)
                : new Failure(new Error($message));
        }

        return is_object($value) && $value instanceof $this->type
            ? new Success($value)
            : new Failure(new Error('%%s must be an instance of %s', $this->type));
    }
}
