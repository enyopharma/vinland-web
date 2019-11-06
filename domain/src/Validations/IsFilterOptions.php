<?php

declare(strict_types=1);

namespace Domain\Validations;

use Quanta\Validation\Input;
use Quanta\Validation\InputInterface;

final class IsFilterOptions
{
    public function __invoke(array $data): InputInterface
    {
        $slice = new Slice;
        $isint = new IsTypedAs('integer');
        $isgt0 = new IsGreaterThan(1);

        $factory = Input::pure(fn (int $threshold) => compact('threshold'));

        $threshold = $slice($data, 'threshold')->validate($isint, $isgt0);

        return $factory($threshold);
    }
}
