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
            ->select('taxon_id, ncbi_taxon_id, name, left_value, right_value, nb_interactions')
            ->from('taxa')
            ->where('ncbi_taxon_id = ?')
            ->prepare();

        $select_taxon_sth->execute([$ncbi_taxon_id]);

        return Statement::from($this->formatone($select_taxon_sth));
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

        return Statement::from($this->formatlist($select_taxa_sth));
    }

    private function names(int $left_value, int $right_value): array
    {
        $select_names_sth = Query::instance($this->pdo)
            ->select('p.name')
            ->from('taxa AS t, proteins AS p')
            ->where('t.ncbi_taxon_id = p.ncbi_taxon_id')
            ->where('t.left_value >= ? AND t.right_value <= ?')
            ->groupBy('p.name')
            ->prepare();

        $select_names_sth->execute([$left_value, $right_value]);

        return ($names = $select_names_sth->fetchAll()) ? $names : [];
    }

    private function children(int $taxon_id): array
    {
        $select_children_sth = Query::instance($this->pdo)
            ->select('ncbi_taxon_id, name, nb_interactions')
            ->from('taxa')
            ->where('parent_taxon_id = ?')
            ->where('nb_interactions > 0')
            ->orderBy('nb_interactions DESC')
            ->prepare();

        $select_children_sth->execute([$taxon_id]);

        $generator = $this->formatlist($select_children_sth);

        return iterator_to_array($generator);
    }

    private function formatone(\PDOStatement $sth): \Generator
    {
        while ($taxon = $sth->fetch()) {
            yield [
                'ncbi_taxon_id' => $taxon['ncbi_taxon_id'],
                'name' => $taxon['name'],
                'nb_interactions' => $taxon['nb_interactions'],
                'names' => $this->names($taxon['left_value'], $taxon['right_value']),
                'children' => $this->children($taxon['taxon_id']),
            ];
        }
    }

    private function formatlist(\PDOStatement $sth): \Generator
    {
        while ($taxon = $sth->fetch()) {
            yield [
                'ncbi_taxon_id' => $taxon['ncbi_taxon_id'],
                'name' => $taxon['name'],
                'nb_interactions' => $taxon['nb_interactions'],
                'names' => [],
                'children' => [],
            ];
        }
    }
}
