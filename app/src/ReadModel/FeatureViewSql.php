<?php

declare(strict_types=1);

namespace App\ReadModel;

final class FeatureViewSql implements FeatureViewInterface
{
    const SELECT_FEATURES_SQL = <<<SQL
        SELECT type, description, sequence, start, stop
        FROM features
        WHERE sequence_id = ?
        ORDER BY start ASC, (stop - start) DESC
    SQL;

    public function __construct(
        private \PDO $pdo,
    ) {
    }

    public function all(int $isoform_id): Statement
    {
        $select_features_sth = $this->pdo->prepare(self::SELECT_FEATURES_SQL);

        $select_features_sth->execute([$isoform_id]);

        return Statement::from($select_features_sth);
    }
}
