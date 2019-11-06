<?php

declare(strict_types=1);

namespace Domain\Validations;

use Quanta\Validation\Input;
use Quanta\Validation\InputInterface;

final class IsVirusOptions
{
    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function __invoke(array $data): InputInterface
    {
        $slice = new Slice;
        $isarr = new IsTypedAs('array');
        $isstr = new IsTypedAs('string');

        $sanitize = Input::pure(new SanitizeStrs);

        $factory = Input::pure(fn (array $taxon, string ...$names) => [
            'left' => $taxon['left'], 'right' => $taxon['right'], 'names' => $names,
        ]);

        $taxon = Input::unit($data)->validate(new IsTaxaOptions($this->pdo));
        $names = $slice($data, 'names')->validate($isarr)->unpack($isstr);

        $names = $sanitize(...$names)->unpack();

        return $factory($taxon, ...$names);
    }
}
