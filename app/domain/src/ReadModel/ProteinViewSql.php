<?php

declare(strict_types=1);

namespace Domain\ReadModel;

final class ProteinViewSql implements ProteinViewInterface
{
    const H = 'h';
    const V = 'v';

    private \PDO $pdo;

    const SELECT_PROTEINS_SQL = <<<SQL
        SELECT id, type, ncbi_taxon_id, accession, name, description
        FROM proteins
        WHERE type = ? AND %s
        LIMIT ?
    SQL;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function id(int $ncbi_taxon_id): Statement
    {
        return Statement::from([]);
    }

    public function search(string $type, string $query, int $limit): Statement
    {
        if (! in_array($type, [self::H, self::V])) {
            return Statement::from([]);
        }

        $qs = array_map(fn ($q) => '%' . trim($q) . '%', array_filter(explode('+', $query)));

        if (count($qs) == 0) {
            return Statement::from([]);
        }

        $where = implode(' AND ', array_pad([], count($qs), 'search ILIKE ?'));

        $select_proteins_sth = $this->pdo->prepare(sprintf(self::SELECT_PROTEINS_SQL, $where));

        $select_proteins_sth->execute([$type, ...$qs, $limit]);

        return Statement::from($this->generator($select_proteins_sth));
    }

    private function generator(\PDOStatement $sth): \Generator
    {
        while ($row = $sth->fetch()) {
            yield new ProteinSql(
                $this->pdo,
                $row['id'],
                $row['type'],
                $row['ncbi_taxon_id'],
                $row['accession'],
                $row['name'],
                $row,
            );
        }
    }
}
