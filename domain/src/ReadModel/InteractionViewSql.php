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
        $sths = [];

        if ($input->wantsHHNetwork()) {
            $sths[] = $this->HHNetwork($input);
        }

        if ($input->wantsHHInteractions()) {
            $sths[] = $this->HHInteractions($input);
        }

        if ($input->wantsVHInteractions()) {
            $sths[] = $this->VHInteractions($input);
        }

        return new Statement($this->generator(...$sths));
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
                        'taxon' => 'Homo sapiens',
                    ],
                    'protein2' => [
                        'type' => $interaction['type2'],
                        'accession' => $interaction['accession2'],
                        'name' => $interaction['name2'],
                        'description' => $interaction['description2'],
                        'taxon' => $interaction['taxon_name'] ?? 'Homo sapiens',
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

    private function query(): Query
    {
        return Query::instance($this->pdo)
            ->select('DISTINCT i.id, i.type, i.protein1_id, i.protein2_id')
            ->select('p1.type AS type1, p1.accession AS accession1, p1.name AS name1, p1.description AS description1')
            ->select('p2.type AS type2, p2.accession AS accession2, p2.name AS name2, p2.description AS description2')
            ->select('i.nb_publications, i.nb_methods')
            ->from('interactions AS i')
            ->from('proteins AS p1, proteins AS p2')
            ->where('p1.id = i.protein1_id AND p2.id = i.protein2_id')
            ->where('i.type = ? AND i.nb_publications >= ? AND i.nb_methods >= ?');
    }

    private function HHNetwork(QueryInput $input): \PDOStatement
    {
        [$identifiers] = $input->human();
        [$publications, $methods] = $input->filters();

        $select_interactions_sth = $this->query()
            ->from('proteins_xrefs AS x1, proteins_xrefs AS x2')
            ->where('p1.id = x1.protein_id AND p2.id = x2.protein_id')
            ->in('x1.ref', count($identifiers))
            ->in('x2.ref', count($identifiers))
            ->prepare();

        $select_interactions_sth->execute([
            ...[self::HH, $publications, $methods],
            ...$identifiers,
            ...$identifiers,
        ]);

        return $select_interactions_sth;
    }

    public function HHInteractions(QueryInput $input): \PDOStatement
    {
        [$identifiers] = $input->human();
        [$publications, $methods] = $input->filters();

        $select_interactions_sth = $this->query()
            ->from('edges AS e, proteins_xrefs AS x')
            ->where('i.id = e.interaction_id')
            ->where('e.source_id = x.protein_id')
            ->in('x.ref', count($identifiers))
            ->prepare();

        $select_interactions_sth->execute([
            ...[self::HH, $publications, $methods],
            ...$identifiers,
        ]);

        return $select_interactions_sth;
    }

    public function VHInteractions(QueryInput $input): \PDOStatement
    {
        [$identifiers] = $input->human();
        [$left, $right, $names] = $input->virus();
        [$publications, $methods] = $input->filters();

        // get the base query.
        $query = $this->query();

        // add taxon name.
        $query = $query
            ->select('tn.name AS taxon_name')
            ->from('taxon AS t, taxon_name AS tn')
            ->where('t.taxon_id = tn.taxon_id')
            ->where('t.ncbi_taxon_id = p2.ncbi_taxon_id')
            ->where('tn.name_class = ?');

        // add human ref filter.
        $query = $query
            ->from('proteins_xrefs AS x1')
            ->where('p1.id = x1.protein_id')
            ->in('x1.ref', count($identifiers));

        // add viral name filter.
        $query = $query->in('p2.name', count($names));

        // add viral taxon filter when needed.
        $taxon = [];

        if ($left > 0 && $right > 0) {
            array_push($taxon, $left, $right);

            $query = $query->where('t.left_value >= ? AND t.right_value <= ?');
        }

        // prepare and execute the query.
        $select_interactions_sth = $query->prepare();

        $select_interactions_sth->execute([
            ...[self::VH, $publications, $methods],
            ...[self::NAME_CLASS],
            ...$identifiers,
            ...$names,
            ...$taxon,
        ]);

        return $select_interactions_sth;
    }
}
