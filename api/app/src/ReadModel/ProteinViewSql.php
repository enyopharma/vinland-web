<?php

declare(strict_types=1);

namespace App\ReadModel;

final class ProteinViewSql implements ProteinViewInterface
{
    const H = 'h';
    const V = 'v';

    private \PDO $pdo;

    const SELECT_PROTEIN_SQL = <<<SQL
        SELECT id, type, ncbi_taxon_id, accession, name, description
        FROM proteins
        WHERE id = ?
    SQL;

    const SELECT_TAXON_SQL = <<<SQL
        SELECT name FROM taxa WHERE ncbi_taxon_id = ?
    SQL;

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

    public function id(int $id): Statement
    {
        $select_protein_sth = $this->pdo->prepare(self::SELECT_PROTEIN_SQL);

        $select_protein_sth->execute([$id]);

        if (! $protein = $select_protein_sth->fetch()) {
            return Statement::from([]);
        }

        if ($protein['type'] == self::H) {
            return Statement::from([$this->protein($protein + ['taxon' => 'Homo sapiens'])]);
        }

        $select_taxon_sth = $this->pdo->prepare(self::SELECT_TAXON_SQL);

        $select_taxon_sth->execute([$protein['ncbi_taxon_id']]);

        if (! $taxon = $select_taxon_sth->fetch()) {
            throw new \LogicException('missing taxon');
        }

        return Statement::from([$this->protein($protein + ['taxon' => $taxon['name']])]);
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
            yield $this->protein($row);
        }
    }

    private function protein(array $row): ProteinInterface
    {
        return new ProteinSql(
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
