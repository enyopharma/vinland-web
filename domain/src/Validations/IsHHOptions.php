<?php

declare(strict_types=1);

namespace Domain\Validations;

use Quanta\Validation\Input;
use Quanta\Validation\InputInterface;

final class IsHHOptions
{
    public function __invoke(array $data): InputInterface
    {
        $slice = new Slice;
        $isbool = new IsTypedAs('boolean');

        $factory = Input::pure(fn (bool $show, bool $network) => compact('show', 'network'));

        $show = $slice($data, 'show')->validate($isbool);
        $network = $slice($data, 'network')->validate($isbool);

        return $factory($show, $network);
    }
}
