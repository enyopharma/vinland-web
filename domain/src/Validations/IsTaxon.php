<?php

declare(strict_types=1);

namespace Domain\Validations;

use Quanta\Validation\Is;
use Quanta\Validation\Field;
use Quanta\Validation\Error;
use Quanta\Validation\Merged;
use Quanta\Validation\InputInterface;
use Quanta\Validation\Rules\OfType;
use Quanta\Validation\Rules\GreaterThan;

final class IsTaxon
{
    const SPECIES = 'species';

    const SELECT_TAXON_SQL = <<<SQL
        SELECT COUNT(*)
        FROM taxon
        WHERE node_rank = ? AND left_value >= ? AND right_value <= ?
    SQL;

    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function __invoke(array $data): InputInterface
    {
        $isint = new Is(new OfType('integer'));
        $isgt0 = new Is(new GreaterThan(0));

        $validation = new Merged(
            Field::required('left', $isint, $isgt0),
            Field::required('right', $isint, $isgt0),
        );

        return $validation($data)
            ->bind(new Is([$this, 'isLeftLTERight']))
            ->bind(new Is([$this, 'isOnlyOneSpecies']));
    }

    public function isLeftLTERight(array $taxon): array
    {
        return $taxon['left'] <= $taxon['right'] ? [] : [
            new Error('left must be less than or equal to right'),
        ];
    }

    public function isOnlyOneSpecies(array $taxon): array
    {
        $select_taxon_sth = $this->pdo->prepare(self::SELECT_TAXON_SQL);

        $select_taxon_sth->execute([self::SPECIES, $taxon['left'], $taxon['right']]);

        $species = ($nb = $select_taxon_sth->fetchColumn()) ? $nb : 0;

        return $species <= 1 ? [] : [
            new Error('must match only one species'),
        ];
    }
}
