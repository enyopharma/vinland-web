<?php

declare(strict_types=1);

namespace App\ReadModel;

final class ProteinViewSql implements ProteinViewInterface
{
    const H = 'h';
    const V = 'v';

    private \PDO $pdo;

    const SELECT_HUMAN_PROTEINS_SQL = <<<SQL
        SELECT id, type, ncbi_taxon_id, accession, name, description, 'Homo sapiens' AS taxon
        FROM proteins
        WHERE type = ? AND search ILIKE ALL(?)
        LIMIT ?
    SQL;

    const SELECT_VIRAL_PROTEINS_SQL = <<<SQL
        SELECT p.id, p.type, p.ncbi_taxon_id, p.accession, p.name, p.description, t.name AS taxon
        FROM proteins AS p, taxa AS t
        WHERE p.ncbi_taxon_id = t.ncbi_taxon_id AND type = ? AND search ILIKE ALL(?)
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

        $select_proteins_sth = $type == self::H
            ? $this->pdo->prepare(self::SELECT_HUMAN_PROTEINS_SQL)
            : $this->pdo->prepare(self::SELECT_VIRAL_PROTEINS_SQL);

        $select_proteins_sth->execute([$type, '{' . implode(',', $qs) . '}', $limit]);

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
