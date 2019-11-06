<?php

declare(strict_types=1);

namespace Domain\Validations;

use Quanta\Validation\Input;
use Quanta\Validation\InputInterface;

final class IsHumanOptions
{
    private $limit;

    public function __construct(int $limit)
    {
        $this->limit = $limit;
    }

    public function __invoke(array $data): InputInterface
    {
        $slice = new Slice;
        $isarr = new IsTypedAs('array');
        $isstr = new IsTypedAs('string');
        $islte = new IsLessThan($this->limit);

        $sanitize = Input::pure(new SanitizeStrs);

        $factory = Input::pure(fn (string ...$identifiers) => [
            'identifiers' => array_map('strtoupper', $identifiers)
        ]);

        $identifiers = $slice($data, 'identifiers')->validate($isarr)->unpack($isstr);

        $identifiers = $sanitize(...$identifiers)->validate($islte)->unpack();

        return $factory(...$identifiers);
    }
}
