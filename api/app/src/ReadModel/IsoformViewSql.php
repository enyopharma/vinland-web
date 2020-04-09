<?php

declare(strict_types=1);

namespace App\ReadModel;

final class IsoformViewSql implements IsoformViewInterface
{
    private \PDO $pdo;

    private int $protein_id;

    const SELECT_ISOFORM_SQL = <<<SQL
        SELECT id, accession, sequence, is_canonical
        FROM sequences
        WHERE protein_id = ? AND id = ?
    SQL;

    public function __construct(\PDO $pdo, int $protein_id)
    {
        $this->pdo = $pdo;
        $this->protein_id = $protein_id;
    }

    public function id(int $id): Statement
    {
        $select_isoform_sth = $this->pdo->prepare(self::SELECT_ISOFORM_SQL);

        $select_isoform_sth->execute([$this->protein_id, $id]);

        return Statement::from($this->generator($select_isoform_sth));
    }

    private function generator(\PDOStatement $sth): \Generator
    {
        while ($row = $sth->fetch()) {
            yield new Entity($row);
        }
    }
}
