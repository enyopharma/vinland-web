<?php

declare(strict_types=1);

namespace App\ReadModel;

use App\Input\InteractionQueryInput;

final class InteractionViewSql implements InteractionViewInterface
{
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

    private function selectHHInteractionsQuery(int $nb, bool $neighbors): Query
    {
        $query = Query::instance($this->pdo)
            ->select('DISTINCT i.id, i.type, i.nb_publications, i.nb_methods')
            ->select('p1.id AS id1, p1.type AS type1, p1.accession AS accession1, p1.name AS name1, p1.description AS description1')
            ->select('p2.id AS id2, p2.type AS type2, p2.accession AS accession2, p2.name AS name2, p2.description AS description2')
            ->from('edges AS e, interactions AS i, proteins AS p1, proteins AS p2')
            ->where('i.id = e.interaction_id')
            ->where('p1.id = i.protein1_id')
            ->where('p2.id = i.protein2_id')
            ->where('i.type = \'hh\'')
            ->where('i.nb_publications >= ?')
            ->where('i.nb_methods >= ?')
            ->in('e.source_id', $nb);

        return $neighbors ? $query : $query->in('e.target_id', $nb);
    }

    private function selectVHInteractionsQuery(int $nbh, int $nbv): Query
    {
        $query = Query::instance($this->pdo)
            ->select('DISTINCT i.id, i.type, i.nb_publications, i.nb_methods')
            ->select('p1.id AS id1, p1.type AS type1, p1.accession AS accession1, p1.name AS name1, p1.description AS description1')
            ->select('p2.id AS id2, p2.type AS type2, p2.accession AS accession2, p2.name AS name2, p2.description AS description2')
            ->select('t.ncbi_taxon_id, t.name AS taxon_name')
            ->select('s.ncbi_taxon_id AS ncbi_species_id, s.name AS species_name')
            ->from('interactions AS i, proteins AS p1, proteins AS p2, taxa AS t, taxa AS s')
            ->where('p1.id = i.protein1_id')
            ->where('p2.id = i.protein2_id')
            ->where('t.ncbi_taxon_id = p2.ncbi_taxon_id')
            ->where('s.ncbi_taxon_id = t.ncbi_species_id')
            ->where('i.type = \'vh\'')
            ->where('i.nb_publications >= ?')
            ->where('i.nb_methods >= ?');

        if ($nbh > 0) {
            $query = $query->in('p1.id', $nbh);
        }

        if ($nbv > 0) {
            $query = $query->in('p2.id', $nbv);
        }

        return $query;
    }

    public function all(InteractionQueryInput $input): Statement
    {
        $hh = $input->hh();
        $vh = $input->vh();
        $neighbors = $input->neighbors();
        [$identifiers] = $input->human();
        [$ncbi_taxon_id, $names] = $input->virus();
        [$nb_publications, $nb_methods] = $input->filters();

        $idhs = $this->humanProteinIds(...$identifiers);
        $idvs = $this->viralProteinIds($ncbi_taxon_id, ...$names);

        $hhinteractions = $hh
            ? $this->HHInteractions($idhs, $nb_publications, $nb_methods, $neighbors)
            : [];

        $vhinteractions = $vh
            ? $this->VHInteractions($idhs, $idvs, $ncbi_taxon_id, $nb_publications, $nb_methods)
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

    private function HHInteractions(array $ids, int $nb_publications, int $nb_methods, bool $neighbors): iterable
    {
        if (count($ids) == 0) {
            return [];
        }

        $params = $neighbors
            ? [$nb_publications, $nb_methods, ...$ids]
            : [$nb_publications, $nb_methods, ...$ids, ...$ids];

        $select_interactions_sth = $this->selectHHInteractionsQuery(count($ids), $neighbors)->prepare();

        $select_interactions_sth->execute($params);

        return $this->generator($select_interactions_sth);
    }

    private function VHInteractions(array $idhs, array $idvs, int $ncbi_taxon_id, int $nb_publications, int $nb_methods): iterable
    {
        if ((count($idhs) == 0 || $ncbi_taxon_id > 0) && count($idvs) == 0) {
            return [];
        }

        $params = [$nb_publications, $nb_methods, ...$idhs, ...$idvs];

        $select_interactions_sth = $this->selectVHInteractionsQuery(count($idhs), count($idvs))->prepare();

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

    private function generator(iterable $rows): \Generator
    {
        foreach ($rows as $row) {
            yield [
                'id' => $row['id'],
                'type' => $row['type'],
                'protein1' => [
                    'id' => $row['id1'],
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
                    'id' => $row['id2'],
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
            ];
        }
    }
}
