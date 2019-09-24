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
                'protein1' => [
                    'accession' => $interaction['accession1'],
                    'name' => $interaction['name1'],
                    'description' => $interaction['description1'],
                    'taxon' => 'Homo sapiens',
                ],
                'protein2' => [
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
            ->select('p1.accession AS accession1, p1.name AS name1, p1.description AS description1')
            ->select('p2.accession AS accession2, p2.name AS name2, p2.description AS description2')
            ->select('i.nb_publications, i.nb_methods')
            ->from('interactions AS i, proteins AS p1, proteins AS p2')
            ->where('p1.id = i.protein1_id AND p2.id = i.protein2_id')
            ->where('i.type = ? AND i.nb_publications >= ? AND i.nb_methods >= ?');
    }

    public function HHNetwork(StrCollection $accessions, int $publication, int $method): Statement
    {
        $select_interactions_sth = $this->query()
            ->in('p1.accession', $accessions->count())
            ->in('p2.accession', $accessions->count())
            ->prepare();

        $select_interactions_sth->execute([
            ...[\Domain\Interaction::HH, $publication, $method],
            ...$accessions->values(),
            ...$accessions->values(),
        ]);

        return new Statement($this->generator($select_interactions_sth));
    }

    public function HHInteractions(StrCollection $accessions, int $publication, int $method): Statement
    {
        $select_interactions_sth = $this->query()
            ->from('edges AS e, proteins AS s')
            ->where('s.id = e.source_id')
            ->in('s.accession', $accessions->count())
            ->prepare();

        $select_interactions_sth->execute([
            ...[\Domain\Interaction::HH, $publication, $method],
            ...$accessions->values(),
        ]);

        return new Statement($this->generator($select_interactions_sth));
    }

    public function VHInteractions(StrCollection $accessions, int $left, int $right, StrCollection $names, int $publication, int $method): Statement
    {
        $query = $this->query()
            ->select('t.left_value, t.right_value, tn.name AS taxon_name')
            ->from('taxon AS t, taxon_name AS tn')
            ->where('t.ncbi_taxon_id = p2.ncbi_taxon_id')
            ->where('t.taxon_id = tn.taxon_id')
            ->in('p1.accession', $accessions->count())
            ->in('p2.name', $names->count())
            ->where('tn.name_class = ?');

        $taxon = [\Domain\Taxon::NAME_CLASS];

        if ($left > 0 && $right > 0) {
            array_push($taxon, $left, $right);

            $query = $query->where('t.left_value >= ? AND t.right_value <= ?');
        }

        $select_interactions_sth = $query->prepare();

        $select_interactions_sth->execute([
            ...[\Domain\Interaction::VH, $publication, $method],
            ...$accessions->values(),
            ...$names->values(),
            ...$taxon
        ]);

        return new Statement($this->generator($select_interactions_sth));
    }
}
