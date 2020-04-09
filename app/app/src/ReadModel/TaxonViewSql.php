<?php

declare(strict_types=1);

namespace App\ReadModel;

final class TaxonViewSql implements TaxonViewInterface
{
    private \PDO $pdo;

    const SELECT_TAXON_SQL = <<<SQL
        SELECT taxon_id, ncbi_taxon_id, name, left_value, right_value, nb_interactions
        FROM taxa
        WHERE ncbi_taxon_id = ?
    SQL;

    const SELECT_TAXA_SQL = <<<SQL
        SELECT taxon_id, ncbi_taxon_id, name, left_value, right_value, nb_interactions
        FROM taxa
        WHERE name ILIKE ALL(?)
        ORDER BY nb_interactions DESC
        LIMIT ?
    SQL;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function id(int $ncbi_taxon_id): Statement
    {
        $select_taxon_sth = $this->pdo->prepare(self::SELECT_TAXON_SQL);

        $select_taxon_sth->execute([$ncbi_taxon_id]);

        return Statement::from($this->generator($select_taxon_sth));
    }

    public function search(string $query, int $limit): Statement
    {
        $qs = array_map(fn ($q) => '%' . trim($q) . '%', array_filter(explode('+', $query)));

        if (count($qs) == 0) {
            return Statement::from([]);
        }

        $select_taxa_sth = $this->pdo->prepare(self::SELECT_TAXA_SQL);

        $select_taxa_sth->execute(['{' . implode(',', $qs) . '}', $limit]);

        return Statement::from($this->generator($select_taxa_sth));
    }

    private function generator(\PDOStatement $sth): \Generator
    {
        while ($row = $sth->fetch()) {
            yield new TaxonSql(
                $this->pdo,
                $row['taxon_id'],
                $row['ncbi_taxon_id'],
                $row['left_value'],
                $row['right_value'],
                $row['name'],
                $row,
            );
        }
    }
}
