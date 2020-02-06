<?php

declare(strict_types=1);

namespace Domain\ReadModel;

use Domain\Input\QueryInput;

final class InteractionViewSql implements InteractionViewInterface
{
    private const HH  = 'hh';
    private const VH  = 'vh';

    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    private function selectHumanProteinIdsQuery(string ...$identifiers): Query
    {
        return Query::instance($this->pdo)
            ->select('p.id')
            ->from('proteins AS p, proteins_xrefs AS x')
            ->where('p.id = x.protein_id')
            ->in('x.ref', count($identifiers));
    }

    private function selectViralProteinIdsQuery(string ...$names): Query
    {
        $query = Query::instance($this->pdo)
            ->select('p.id')
            ->from('proteins AS p, taxa AS t1, taxa AS t2')
            ->where('p.ncbi_taxon_id = t1.ncbi_taxon_id')
            ->where('t1.left_value >= t2.left_value')
            ->where('t1.right_value <= t2.right_value')
            ->where('t2.ncbi_taxon_id = ?');

        return count($names) > 0
            ? $query->in('p.name', count($names))
            : $query;
    }

    private function selectInteractionsQuery(string $type, bool $neighbors, int ...$ids): Query
    {
        $query = Query::instance($this->pdo)
            ->select('DISTINCT i.type, i.nb_publications, i.nb_methods')
            ->select('p1.type AS type1, p1.accession AS accession1, p1.name AS name1, p1.description AS description1')
            ->select('p2.type AS type2, p2.accession AS accession2, p2.name AS name2, p2.description AS description2')
            ->from('edges AS e, interactions AS i, proteins AS p1, proteins AS p2')
            ->where('i.id = e.interaction_id')
            ->where('p1.id = i.protein1_id')
            ->where('p2.id = i.protein2_id')
            ->where('i.type = ?')
            ->where('i.nb_publications >= ?')
            ->where('i.nb_methods >= ?');

        if ($type == self::VH) {
            $query = $query
                ->select('t.ncbi_taxon_id, t.name AS taxon_name')
                ->select('s.ncbi_taxon_id AS ncbi_species_id, s.name AS species_name')
                ->from('taxa AS t, taxa AS s')
                ->where('t.ncbi_taxon_id = p2.ncbi_taxon_id')
                ->where('s.ncbi_taxon_id = t.ncbi_species_id');
        }

        $query = $query->in('e.source_id', count($ids));

        return $neighbors ? $query : $query->in('e.target_id', count($ids));
    }

    public function all(QueryInput $input): Statement
    {
        $hh = $input->hh();
        $vh = $input->vh();
        $neighbors = $input->neighbors();
        [$identifiers] = $input->human();
        [$ncbi_taxon_id, $names] = $input->virus();
        [$nb_publications, $nb_methods] = $input->filters();

        $ids = [
            ...$this->humanProteinIds(...$identifiers),
            ...$this->viralProteinIds($ncbi_taxon_id, ...$names),
        ];

        $hhinteractions = $hh
            ? $this->interactions(self::HH, $neighbors, $nb_publications, $nb_methods, ...$ids)
            : [];

        $vhinteractions = $vh
            ? $this->interactions(self::VH, $neighbors, $nb_publications, $nb_methods, ...$ids)
            : [];

        return Statement::from($this->merged($hhinteractions, $vhinteractions));
    }

    private function humanProteinIds(string ...$identifiers): array
    {
        if (count($identifiers) == 0) {
            return [];
        }

        $select_ids_sth = $this->selectHumanProteinIdsQuery(...$identifiers)->prepare();

        $select_ids_sth->execute($identifiers);

        $ids = $select_ids_sth->fetchAll(\PDO::FETCH_COLUMN);

        if ($ids === false) {
            throw new \LogicException;
        }

        return $ids;
    }

    private function viralProteinIds(int $ncbi_taxon_id, string ...$names): array
    {
        if ($ncbi_taxon_id < 1) {
            return [];
        }

        $select_ids_sth = $this->selectViralProteinIdsQuery(...$names)->prepare();

        $select_ids_sth->execute([$ncbi_taxon_id, ...$names]);

        $ids = $select_ids_sth->fetchAll(\PDO::FETCH_COLUMN);

        if ($ids === false) {
            throw new \LogicException;
        }

        return $ids;
    }

    private function interactions(string $type, bool $neighbors, int $nb_publications, int $nb_methods, int ...$ids): iterable
    {
        if (count($ids) == 0) {
            return [];
        }

        $params = $neighbors
            ? [$type, $nb_publications, $nb_methods, ...$ids]
            : [$type, $nb_publications, $nb_methods, ...$ids, ...$ids];

        $select_interactions_sth = $this->selectInteractionsQuery($type, $neighbors, ...$ids)->prepare();

        $select_interactions_sth->execute($params);

        return $this->generator($select_interactions_sth);
    }

    private function merged(iterable ...$iterables): \Generator
    {
        foreach ($iterables as $iterable) {
            foreach ($iterable as $value) {
                yield $value;
            }
        }
    }

    private function generator(\PDOStatement $sth): \Generator
    {
        while ($row = $sth->fetch()) {
            yield new Entity([
                'type' => $row['type'],
                'protein1' => [
                    'type' => $row['type1'],
                    'accession' => $row['accession1'],
                    'name' => $row['name1'],
                    'description' => $row['description1'],
                    'taxon' => [
                        'ncbi_taxon_id' => 9606,
                        'name' => 'Homo sapiens',
                    ],
                    'species' => [
                        'ncbi_taxon_id' => 9606,
                        'name' => 'Homo sapiens',
                    ],
                ],
                'protein2' => [
                    'type' => $row['type2'],
                    'accession' => $row['accession2'],
                    'name' => $row['name2'],
                    'description' => $row['description2'],
                    'taxon' => [
                        'ncbi_taxon_id' => $row['ncbi_taxon_id'] ?? 9606,
                        'name' => $row['taxon_name'] ?? 'Homo sapiens',
                    ],
                    'species' => [
                        'ncbi_taxon_id' => $row['ncbi_species_id'] ?? 9606,
                        'name' => $row['species_name'] ?? 'Homo sapiens',
                    ],
                ],
                'publications' => [
                    'nb' => $row['nb_publications'],
                ],
                'methods' => [
                    'nb' => $row['nb_methods'],
                ],
            ]);
        }
    }
}
