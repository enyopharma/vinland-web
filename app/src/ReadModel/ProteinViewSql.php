<?php

declare(strict_types=1);

namespace App\ReadModel;

final class ProteinViewSql implements ProteinViewInterface
{
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

    const SELECT_ISOFORMS_SQL = <<<SQL
        SELECT *
        FROM sequences
        WHERE protein_id = ?
        ORDER BY id ASC
    SQL;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function id(int $id, string ...$with): Statement
    {
        $select_protein_sth = $this->pdo->prepare(self::SELECT_PROTEIN_SQL);

        $select_protein_sth->execute([$id]);

        if (! $protein = $select_protein_sth->fetch()) {
            return Statement::from([]);
        }

        if (in_array('isoforms', $with)) {
            $protein['isoforms'] = $this->isoforms($id);
        }

        $generator = $this->generator([$protein]);

        return Statement::from($generator);
    }

    public function search(string $type, string $query, int $limit): Statement
    {
        if (! in_array($type, ['h', 'v'])) {
            return Statement::from([]);
        }

        $qs = array_map(fn ($q) => '%' . trim($q) . '%', array_filter(explode('+', $query)));

        if (count($qs) == 0) {
            return Statement::from([]);
        }

        $select_proteins_sth = $this->pdo->prepare(self::SELECT_PROTEINS_SQL);

        $select_proteins_sth->execute([$type, '{' . implode(',', $qs) . '}', $limit]);

        $generator = $this->generator($select_proteins_sth);

        return Statement::from($generator);
    }

    private function isoforms(int $protein_id): array
    {
        $select_isoforms_sth = $this->pdo->prepare(self::SELECT_ISOFORMS_SQL);

        $select_isoforms_sth->execute([$protein_id]);

        $isoforms = $select_isoforms_sth->fetchAll();

        if ($isoforms === false) {
            throw new \LogicException;
        }

        return $isoforms;
    }

    private function generator(iterable $rows): \Generator
    {
        foreach ($rows as $row) {
            $row['taxon'] = $row['taxon'] ?? 'Homo sapiens';

            yield $row;
        }
    }
}
