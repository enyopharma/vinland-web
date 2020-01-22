<?php

declare(strict_types=1);

namespace Domain\ReadModel;

final class TaxonViewSql implements TaxonViewInterface
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function id(int $ncbi_taxon_id): Statement
    {
        $select_taxon_sth = Query::instance($this->pdo)
            ->select('taxon_id, ncbi_taxon_id, name, left_value, right_value')
            ->from('taxa')
            ->where('ncbi_taxon_id = ?')
            ->prepare();

        $select_taxon_sth->execute([$ncbi_taxon_id]);

        return ($taxon = $select_taxon_sth->fetch())
            ? Statement::from([$taxon])
            : Statement::from([]);
    }

    public function all(string $query, int $limit): Statement
    {
        $qs = array_map(fn ($q) => '%' . trim($q) . '%', array_filter(explode('+', $query)));

        $select_taxa_sth = Query::instance($this->pdo)
            ->select('ncbi_taxon_id, name, nb_interactions')
            ->from('taxa')
            ->where(...array_pad([], count($qs), 'name ILIKE ?'))
            ->orderBy('nb_interactions DESC')
            ->sliced()
            ->prepare();

        $select_taxa_sth->execute([...$qs, ...[$limit, 0]]);

        return ($taxon = $select_taxa_sth->fetchAll())
            ? Statement::from([$taxon])
            : Statement::from([]);
    }

    public function parent(int $taxon_id): Statement
    {
        $select_parent_sth = Query::instance($this->pdo)
            ->select('p.ncbi_taxon_id, p.name, p.nb_interactions')
            ->from('taxa AS t, taxa AS p')
            ->where('p.taxon_id = t.parent_taxon_id')
            ->where('t.taxon_id = ?')
            ->prepare();

        $select_parent_sth->execute([$taxon_id]);

        return ($parent = $select_parent_sth->fetch())
            ? Statement::from([$parent])
            : Statement::from([null]);
    }

    public function children(int $taxon_id): Statement
    {
        $select_children_sth = Query::instance($this->pdo)
            ->select('ncbi_taxon_id, name, nb_interactions')
            ->from('taxa')
            ->where('parent_taxon_id = ?')
            ->where('nb_interactions > 0')
            ->orderBy('nb_interactions DESC')
            ->prepare();

        $select_children_sth->execute([$taxon_id]);

        return ($children = $select_children_sth->fetchAll())
            ? Statement::from($children)
            : Statement::from([]);
    }

    public function names(int $left_value, int $right_value): Statement
    {
        $select_names_sth = Query::instance($this->pdo)
            ->select('DISTINCT p.name')
            ->from('taxa AS t, proteins AS p')
            ->where('t.ncbi_taxon_id = p.ncbi_taxon_id')
            ->where('t.left_value >= ? AND t.right_value <= ?')
            ->prepare();

        $select_names_sth->execute([$left_value, $right_value]);

        return ($names = $select_names_sth->fetchAll(\PDO::FETCH_COLUMN))
            ? Statement::from($names)
            : Statement::from([]);
    }
}
