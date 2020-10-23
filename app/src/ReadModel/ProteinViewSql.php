<?php

declare(strict_types=1);

namespace App\ReadModel;

final class ProteinViewSql implements ProteinViewInterface
{
    private \PDO $pdo;

    const SELECT_PROTEIN_SQL = <<<SQL
        SELECT p.id, p.type, p.ncbi_taxon_id, p.accession, p.name, p.description, COALESCE(t.name, 'Homo sapiens') AS taxon
        FROM proteins AS p LEFT JOIN taxonomy AS t ON p.ncbi_taxon_id = t.ncbi_taxon_id
        WHERE p.id = ?
    SQL;

    const SELECT_HUMAN_PROTEINS_SQL = <<<SQL
        SELECT p.id, p.type, p.ncbi_taxon_id, p.accession, p.name, p.description, 'Homo sapiens' AS taxon
        FROM proteins AS p LEFT JOIN edges AS e ON p.id = e.source_id
        WHERE p.type = 'h' AND p.search ILIKE ALL (?::text[])
        GROUP BY p.id
        ORDER BY COUNT(e.id) DESC
        LIMIT ?
    SQL;

    const SELECT_VIRAL_PROTEINS_SQL = <<<SQL
        SELECT p.id, p.type, p.ncbi_taxon_id, p.accession, p.name, p.description, t.name AS taxon
        FROM proteins AS p, edges AS e, taxonomy AS t
        WHERE p.type = 'v'
        AND p.id = e.source_id
        AND p.ncbi_taxon_id = t.ncbi_taxon_id
        AND p.search ILIKE ALL (?::text[])
        GROUP BY p.id, t.taxon_id
        ORDER BY COUNT(e.id) DESC
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

        $proteins = ($protein = $select_protein_sth->fetch()) ? [$protein] : [];

        return Statement::from($proteins);
    }

    public function all(string $type, string $query, int $limit): Statement
    {
        if (!in_array($type, ['h', 'v'])) {
            return Statement::from([]);
        }

        $qs = explode('+', $query);
        $qs = array_map('trim', $qs);
        $qs = array_filter($qs, fn ($q) => strlen($q) > 2);
        $qs = array_map(fn ($q) => '%' . $q . '%', $qs);

        $select_proteins_sth = $type == 'h'
            ? $this->pdo->prepare(self::SELECT_HUMAN_PROTEINS_SQL)
            : $this->pdo->prepare(self::SELECT_VIRAL_PROTEINS_SQL);

        $select_proteins_sth->execute(['{' . implode(',', $qs) . '}', $limit]);

        return Statement::from($select_proteins_sth);
    }
}
