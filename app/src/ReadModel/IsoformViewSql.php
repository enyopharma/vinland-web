<?php

declare(strict_types=1);

namespace App\ReadModel;

final class IsoformViewSql implements IsoformViewInterface
{
    const SELECT_ISOFORM_SQL = <<<SQL
        SELECT * FROM sequences WHERE protein_id = ? AND id = ?
    SQL;

    const SELECT_ISOFORMS_SQL = <<<SQL
        SELECT * FROM sequences WHERE protein_id = ? ORDER BY id ASC
    SQL;

    const SELECT_CANONICAL_SQL = <<<SQL
        SELECT * FROM sequences WHERE protein_id = ? AND is_canonical IS TRUE
    SQL;

    public function __construct(
        private \PDO $pdo,
    ) {}

    public function id(int $protein_id, int $id): Statement
    {
        $select_isoform_sth = $this->pdo->prepare(self::SELECT_ISOFORM_SQL);

        if ($select_isoform_sth === false) throw new \Exception;

        $select_isoform_sth->execute([$protein_id, $id]);

        return Statement::from($select_isoform_sth);
    }

    public function all(int $protein_id): Statement
    {
        $select_isoforms_sth = $this->pdo->prepare(self::SELECT_ISOFORMS_SQL);

        if ($select_isoforms_sth === false) throw new \Exception;

        $select_isoforms_sth->execute([$protein_id]);

        return Statement::from($select_isoforms_sth);
    }

    public function canonical(int $protein_id): Statement
    {
        $select_isoform_sth = $this->pdo->prepare(self::SELECT_CANONICAL_SQL);

        if ($select_isoform_sth === false) throw new \Exception;

        $select_isoform_sth->execute([$protein_id]);

        return Statement::from($select_isoform_sth);
    }
}
