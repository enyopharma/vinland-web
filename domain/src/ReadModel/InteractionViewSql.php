<?php

declare(strict_types=1);

namespace Domain\ReadModel;

use Domain\Input\QueryInput;

final class InteractionViewSql implements InteractionViewInterface
{
    private const HH  = 'hh';
    private const VH  = 'vh';

    private const NAME_CLASS = 'scientific name';

    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all(QueryInput $input): Statement
    {
        $ids = [];
        $ids = [...$ids, ...$this->humanProteinIdList($input)];
        $ids = [...$ids, ...$this->viralProteinIdList($input)];

        if (count($ids) == 0) {
            return Statement::from([]);
        }

        $sths = [];

        $params = [$ids, $input->neighbors(), ...$input->filters()];

        if ($input->hh()) {
            $sths[] = $this->interactions(self::HH, ...$params);
        }

        if ($input->vh()) {
            $sths[] = $this->interactions(self::VH, ...$params);
        }

        return Statement::from($this->generator(...$sths));
    }

    private function humanProteinIdList(QueryInput $input): array
    {
        [$identifiers] = $input->human();

        if (count($identifiers) == 0) {
            return [];
        }

        $select_ids_sth = Query::instance($this->pdo)
            ->select('DISTINCT p.id')
            ->from('proteins AS p, proteins_xrefs AS x')
            ->where('p.id = x.protein_id')
            ->in('x.ref', count($identifiers))
            ->prepare();

        $select_ids_sth->execute($identifiers);

        return ($ids = $select_ids_sth->fetchAll(\PDO::FETCH_COLUMN)) ? $ids : [];
    }

    private function viralProteinIdList(QueryInput $input): array
    {
        [$ncbi_taxon_id, $names] = $input->virus();

        if ($ncbi_taxon_id < 1) {
            return [];
        }

        $select_ids_sth = Query::instance($this->pdo)
            ->select('p.id')
            ->from('proteins AS p, taxa AS t1, taxa AS t2')
            ->where('p.ncbi_taxon_id = t1.ncbi_taxon_id')
            ->where('t1.left_value >= t2.left_value')
            ->where('t1.right_value <= t2.right_value')
            ->where('t2.ncbi_taxon_id = ?')
            ->in('p.name', count($names))
            ->prepare();

        $select_ids_sth->execute([$ncbi_taxon_id, ...$names]);

        return ($ids = $select_ids_sth->fetchAll(\PDO::FETCH_COLUMN)) ? $ids : [];
    }

    private function interactions(string $type, array $ids, bool $neighbors, int $publications, int $methods): \PDOStatement
    {
        $params = $neighbors
            ? [$type, $publications, $methods, ...$ids]
            : [$type, $publications, $methods, ...$ids, ...$ids];

        $select_interactions_sth = $this->query($type, count($ids), $neighbors)->prepare();

        $select_interactions_sth->execute($params);

        return $select_interactions_sth;
    }

    private function basequery(int $nb, bool $neighbors): Query
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
            ->where('i.nb_methods >= ?')
            ->in('e.source_id', $nb);

        return $neighbors ? $query : $query->in('e.target_id', $nb);
    }

    private function hhquery(int $nb, bool $neighbors): Query
    {
        return $this->basequery($nb, $neighbors);
    }

    private function vhquery(int $nb, bool $neighbors): Query
    {
        return $this->basequery($nb, $neighbors)
            ->select('t.ncbi_taxon_id, t.name AS taxon_name')
            ->select('s.ncbi_taxon_id AS ncbi_species_id, s.name AS species_name')
            ->from('taxa AS t, taxa AS s')
            ->where('t.ncbi_taxon_id = p2.ncbi_taxon_id')
            ->where('s.ncbi_taxon_id = t.ncbi_species_id');
    }

    private function query(string $type, int $nb, bool $neighbors): Query
    {
        if ($type == self::HH) {
            return $this->hhquery($nb, $neighbors);
        }

        if ($type == self::VH) {
            return $this->vhquery($nb, $neighbors);
        }

        throw new \UnexpectedValueException($type);
    }

    private function generator(\PDOStatement ...$sths): \Generator
    {
        foreach ($sths as $sth) {
            while ($interaction = $sth->fetch()) {
                yield [
                    'type' => $interaction['type'],
                    'protein1' => [
                        'type' => $interaction['type1'],
                        'accession' => $interaction['accession1'],
                        'name' => $interaction['name1'],
                        'description' => $interaction['description1'],
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
                        'type' => $interaction['type2'],
                        'accession' => $interaction['accession2'],
                        'name' => $interaction['name2'],
                        'description' => $interaction['description2'],
                        'taxon' => [
                            'ncbi_taxon_id' => $interaction['ncbi_taxon_id'] ?? 9606,
                            'name' => $interaction['taxon_name'] ?? 'Homo sapiens',
                        ],
                        'species' => [
                            'ncbi_taxon_id' => $interaction['ncbi_species_id'] ?? 9606,
                            'name' => $interaction['species_name'] ?? 'Homo sapiens',
                        ],
                    ],
                    'publications' => [
                        'nb' => $interaction['nb_publications'],
                    ],
                    'methods' => [
                        'nb' => $interaction['nb_methods'],
                    ],
                ];
            }
        }
    }
}
