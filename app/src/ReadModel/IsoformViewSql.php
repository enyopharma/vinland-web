<?php

declare(strict_types=1);

namespace App\ReadModel;

final class IsoformViewSql implements IsoformViewInterface
{
    private \PDO $pdo;

    const SELECT_ISOFORM_SQL = <<<SQL
        SELECT *
        FROM sequences
        WHERE protein_id = ? AND id = ?
    SQL;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function id(int $protein_id, int $id): Statement
    {
        $select_isoform_sth = $this->pdo->prepare(self::SELECT_ISOFORM_SQL);

        $select_isoform_sth->execute([$protein_id, $id]);

        return Statement::from($select_isoform_sth);
    }
}
