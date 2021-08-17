<?php

declare(strict_types=1);

namespace App\ReadModel;

final class FeatureViewSql implements FeatureViewInterface
{
    const TYPES = [
        'calcium-binding region',
        'DNA-binding region',
        'coiled-coil region',
        'nucleotide phosphate-binding region',
        'short sequence motif',
        'zinc finger region',
        'disulfide bond',
        'turn',
        'topological domain',
        'domain',
        'transmembrane region',
        'helix',
        'strand',
    ];

    const SELECT_FEATURES_SQL = <<<SQL
        SELECT type, description, sequence, start, stop
        FROM features
        WHERE sequence_id = ? AND type = ANY (?::text[])
        ORDER BY start ASC, (stop - start) DESC
    SQL;

    public function __construct(
        private \PDO $pdo,
    ) {
    }

    public function all(int $isoform_id, string ...$types): Statement
    {
        $types = count($types) == 0 ? self::TYPES : array_intersect($types, self::TYPES);

        $select_features_sth = $this->pdo->prepare(self::SELECT_FEATURES_SQL);

        $select_features_sth->execute([$isoform_id, '{' . implode(',', $types) . '}']);

        return Statement::from($select_features_sth);
    }
}
