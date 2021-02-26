<?php

declare(strict_types=1);

namespace App\ReadModel;

final class TaxonViewSql implements TaxonViewInterface
{
    const SELECT_TAXON_SQL = <<<SQL
        SELECT * FROM taxonomy WHERE ncbi_taxon_id = ?
    SQL;

    const SELECT_TAXA_SQL = <<<SQL
        SELECT * FROM taxonomy WHERE name ILIKE ALL(?::text[]) ORDER BY nb_interactions DESC LIMIT ?
    SQL;

    const SELECT_PARENT_SQL = <<< SQL
        SELECT ncbi_taxon_id, name, nb_interactions
        FROM taxonomy
        WHERE taxon_id = ?
    SQL;

    const SELECT_CHILDREN_SQL = <<<SQL
        SELECT ncbi_taxon_id, name, nb_interactions
        FROM taxonomy
        WHERE nb_interactions > 0
        AND parent_taxon_id = ?
        ORDER BY nb_interactions DESC
    SQL;

    const SELECT_NAMES_SQL = <<<SQL
        SELECT DISTINCT p.name
        FROM proteins AS p, taxonomy AS t
        WHERE p.ncbi_taxon_id = t.ncbi_taxon_id
        AND t.left_value >= ?
        AND t.right_value <= ?
    SQL;

    public function __construct(
        private \PDO $pdo,
    ) {}

    public function id(int $ncbi_taxon_id, string ...$with): Statement
    {
        $select_taxon_sth = $this->pdo->prepare(self::SELECT_TAXON_SQL);

        $select_taxon_sth->execute([$ncbi_taxon_id]);

        if (!$taxon = $select_taxon_sth->fetch()) {
            return Statement::from([]);
        }

        if (in_array('related', $with)) {
            $taxon['parent'] = $this->parent($taxon['parent_taxon_id']);
            $taxon['children'] = $this->children($taxon['taxon_id']);
        }

        if (in_array('names', $with)) {
            $taxon['names'] = $this->names($taxon['left_value'], $taxon['right_value']);
        }

        return Statement::from([$taxon]);
    }

    public function search(string $query, int $limit): Statement
    {
        $qs = explode('+', $query);
        $qs = array_map('trim', $qs);
        $qs = array_filter($qs, fn ($q) => strlen($q) > 2);
        $qs = array_map(fn ($q) => '%' . $q . '%', $qs);

        $select_taxa_sth = $this->pdo->prepare(self::SELECT_TAXA_SQL);

        $select_taxa_sth->execute(['{' . implode(',', $qs) . '}', $limit]);

        return Statement::from($select_taxa_sth);
    }

    private function parent(int $taxon_id): ?array
    {
        $select_parent_sth = $this->pdo->prepare(self::SELECT_PARENT_SQL);

        $select_parent_sth->execute([$taxon_id]);

        return ($parent = $select_parent_sth->fetch())
            ? $parent
            : null;
    }

    private function children(int $taxon_id): array
    {
        $select_children_sth = $this->pdo->prepare(self::SELECT_CHILDREN_SQL);

        $select_children_sth->execute([$taxon_id]);

        return ($taxa = $select_children_sth->fetchAll())
            ? $taxa
            : throw new Exception('fetchall ?');
    }

    private function names(int $left_value, int $right_value): array
    {
        $select_names_sth = $this->pdo->prepare(self::SELECT_NAMES_SQL);

        $select_names_sth->execute([$left_value, $right_value]);

        return ($names = $select_names_sth->fetchAll(\PDO::FETCH_COLUMN))
            ? $names
            : throw new Exception('fetchall ?');
    }
}
