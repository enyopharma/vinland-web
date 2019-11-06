<?php

declare(strict_types=1);

namespace Domain\Validations;

use Quanta\Validation\Input;
use Quanta\Validation\Error;
use Quanta\Validation\Success;
use Quanta\Validation\Failure;
use Quanta\Validation\InputInterface;

final class IsTaxaOptions
{
    const SPECIES = 'species';

    const SELECT_TAXON_SQL = <<<SQL
        SELECT COUNT(*)
        FROM taxon
        WHERE node_rank = ? AND left_value >= ? AND right_value <= ?
    SQL;

    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function __invoke(array $data): InputInterface
    {
        $slice = new Slice;
        $isint = new IsTypedAs('integer');
        $ispos = new IsGreaterThan(0);

        $factory = Input::pure(fn (int $left, int $right) => compact('left', 'right'));

        $left = $slice($data, 'left')->validate($isint, $ispos);
        $right = $slice($data, 'right')->validate($isint, $ispos);

        return $factory($left, $right)->validate([$this, 'isLeftLTERight'], [$this, 'isOnlyOneSpecies']);
    }

    public function isLeftLTERight(array $taxon): InputInterface
    {
        return $taxon['left'] == 0 || $taxon['left'] <= $taxon['right']
            ? new Success($taxon)
            : new Failure(new Error('%%s left must be less than or equal to right'));
    }

    public function isOnlyOneSpecies(array $taxon): InputInterface
    {
        $select_taxon_sth = $this->pdo->prepare(self::SELECT_TAXON_SQL);

        $select_taxon_sth->execute([self::SPECIES, $taxon['left'], $taxon['right']]);

        $species = ($nb = $select_taxon_sth->fetchColumn()) ? $nb : 0;

        return $species <= 1
            ? new Success($taxon)
            : new Failure(new Error('%%s must match only one species'));
    }
}
