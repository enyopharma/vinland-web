<?php

declare(strict_types=1);

namespace App\ReadModel;

final class FeatureViewSql implements FeatureViewInterface
{
    const TYPES = [
        'site',
        'turn',
        'chain',
        'helix',
        'domain',
        'repeat',
        'strand',
        'peptide',
        'cross-link',
        'propeptide',
        'disulfide bond',
        'signal peptide',
        'splice variant',
        'transit peptide',
        'mutagenesis site',
        'sequence variant',
        'sequence conflict',
        'coiled-coil region',
        'DNA-binding region',
        'region of interest',
        'topological domain',
        'zinc finger region',
        'intramembrane region',
        'short sequence motif',
        'transmembrane region',
        'calcium-binding region',
        'non-consecutive residues',
        'compositionally biased region',
        'nucleotide phosphate-binding region',
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
        $types = count($types) == 0 ? self::TYPES : $types;

        $select_features_sth = $this->pdo->prepare(self::SELECT_FEATURES_SQL);

        $select_features_sth->execute([$isoform_id, '{' . implode(',', $types) . '}']);

        return Statement::from($select_features_sth);
    }
}
