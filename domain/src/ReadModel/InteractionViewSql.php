<?php

declare(strict_types=1);

namespace Domain\ReadModel;

use Domain\Input\StrCollection;

final class InteractionViewSql implements InteractionViewInterface
{
    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    private function generator(\PDOStatement $sth): \Generator
    {
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

    public function HHNetwork(StrCollection $accessions, int $publication, int $method): Statement
    {
        $select_interactions_sth = $this->query()
            ->from('proteins_xrefs AS x1, proteins_xrefs AS x2')
            ->where('p1.id = x1.protein_id AND p2.id = x2.protein_id')
            ->in('x1.ref', $accessions->count())
            ->in('x2.ref', $accessions->count())
            ->prepare();

        $select_interactions_sth->execute([
            ...[\Domain\Interaction::HH, $publication, $method],
            ...$accessions->uppercased(),
            ...$accessions->uppercased(),
        ]);

        return new Statement($this->generator($select_interactions_sth));
    }

    public function HHInteractions(StrCollection $accessions, int $publication, int $method): Statement
    {
        $select_interactions_sth = $this->query()
            ->from('edges AS e, proteins_xrefs AS x')
            ->where('e.source_id = x.protein_id')
            ->in('x.ref', $accessions->count())
            ->prepare();

        $select_interactions_sth->execute([
            ...[\Domain\Interaction::HH, $publication, $method],
            ...$accessions->uppercased(),
        ]);

        return new Statement($this->generator($select_interactions_sth));
    }

    public function VHInteractions(StrCollection $accessions, int $left, int $right, StrCollection $names, int $publication, int $method): Statement
    {
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
            ->in('x1.ref', $accessions->count());

        // add viral name filter.
        $query = $query->in('p2.name', $names->count());

        // add viral taxon filter.
        $taxon = [];

        if ($left > 0 && $right > 0) {
            array_push($taxon, $left, $right);

            $query = $query->where('t.left_value >= ? AND t.right_value <= ?');
        }

        // prepare and execute the query.
        $select_interactions_sth = $query->prepare();

        $select_interactions_sth->execute([
            ...[\Domain\Interaction::VH, $publication, $method],
            ...[\Domain\Taxon::NAME_CLASS],
            ...$accessions->uppercased(),
            ...$names->values(),
            ...$taxon,
        ]);

        return new Statement($this->generator($select_interactions_sth));
    }
}
