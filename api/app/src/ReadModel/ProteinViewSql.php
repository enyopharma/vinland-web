<?php

declare(strict_types=1);

namespace App\ReadModel;

final class ProteinViewSql implements ProteinViewInterface
{
    const H = 'h';
    const V = 'v';

    private \PDO $pdo;

    const SELECT_PROTEIN_SQL = <<<SQL
        SELECT p.id, p.type, p.ncbi_taxon_id, p.accession, p.name, p.description, taxa.name AS taxon
        FROM proteins AS p
        LEFT JOIN taxa ON taxa.ncbi_taxon_id = p.ncbi_taxon_id
        WHERE id = ?
    SQL;

    const SELECT_PROTEINS_SQL = <<<SQL
        SELECT p.id, p.type, p.ncbi_taxon_id, p.accession, p.name, p.description, taxa.name AS taxon
        FROM proteins AS p
        LEFT JOIN taxa ON taxa.ncbi_taxon_id = p.ncbi_taxon_id
        WHERE type = ? AND search ILIKE ALL(?)
        LIMIT ?
    SQL;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function id(int $id): Statement
    {
        $select_protein_sth = $this->pdo->prepare(self::SELECT_PROTEIN_SQL);

        $select_protein_sth->execute([$id]);

        return Statement::from($this->generator($select_protein_sth));
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

        $select_proteins_sth = $this->pdo->prepare(self::SELECT_PROTEINS_SQL);

        $select_proteins_sth->execute([$type, '{' . implode(',', $qs) . '}', $limit]);

        return Statement::from($this->generator($select_proteins_sth));
    }

    private function generator(\PDOStatement $sth): \Generator
    {
        while ($row = $sth->fetch()) {
            $row['taxon'] = $row['taxon'] ?? 'Homo sapiens';

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
