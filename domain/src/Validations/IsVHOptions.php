<?php

declare(strict_types=1);

namespace Domain\Validations;

use Quanta\Validation\Input;
use Quanta\Validation\InputInterface;

final class IsVHOptions
{
    public function __invoke(array $data): InputInterface
    {
        $slice = new Slice;
        $isbool = new IsTypedAs('boolean');

        $factory = Input::pure(fn (bool $show) => compact('show'));

        $show = $slice($data, 'show')->validate($isbool);

        return $factory($show);
    }
}
