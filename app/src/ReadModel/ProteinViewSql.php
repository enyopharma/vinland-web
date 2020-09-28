<?php

declare(strict_types=1);

namespace App\ReadModel;

final class ProteinViewSql implements ProteinViewInterface
{
    private \PDO $pdo;

    const SELECT_PROTEIN_SQL = <<<SQL
        SELECT p.id, p.type, p.ncbi_taxon_id, p.accession, p.name, p.description, COALESCE(t.name, 'Homo sapiens') AS taxon
        FROM proteins AS p LEFT JOIN taxa AS t ON p.ncbi_taxon_id = t.ncbi_taxon_id
        WHERE p.id = ?
    SQL;

    const SELECT_PROTEINS_SQL = <<<SQL
        SELECT p.id, p.type, p.ncbi_taxon_id, p.accession, p.name, p.description, COALESCE(t.name, 'Homo sapiens') AS taxon
        FROM proteins AS p LEFT JOIN taxa AS t ON p.ncbi_taxon_id = t.ncbi_taxon_id
        WHERE p.type = ? AND %s
        LIMIT ?
    SQL;

    const SELECT_ISOFORMS_SQL = <<<SQL
        SELECT * FROM sequences WHERE protein_id = ? ORDER BY id ASC
    SQL;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function id(int $id, string ...$with): Statement
    {
        $select_protein_sth = $this->pdo->prepare(self::SELECT_PROTEIN_SQL);

        $select_protein_sth->execute([$id]);

        if (!$protein = $select_protein_sth->fetch()) {
            return Statement::from([]);
        }

        if (in_array('isoforms', $with)) {
            $protein['isoforms'] = $this->isoforms($id);
        }

        return Statement::from([$protein]);
    }

    public function search(string $type, string $query, int $limit): Statement
    {
        if (!in_array($type, ['h', 'v'])) {
            return Statement::from([]);
        }

        $qs = explode('+', $query);
        $qs = array_map('trim', $qs);
        $qs = array_filter($qs, fn ($q) => strlen($q) > 2);
        $qs = array_map(fn ($q) => '%' . $q . '%', $qs);

        if (count($qs) == 0) {
            return Statement::from([]);
        }

        $where = implode(' AND ', array_pad([], count($qs), 'p.search ILIKE ?'));

        $select_proteins_sth = $this->pdo->prepare(sprintf(self::SELECT_PROTEINS_SQL, $where));

        $select_proteins_sth->execute([$type, ...$qs, $limit]);

        return Statement::from($select_proteins_sth);
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
}
