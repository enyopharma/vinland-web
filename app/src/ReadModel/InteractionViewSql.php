<?php

declare(strict_types=1);

namespace App\ReadModel;

use App\Input\InteractionQueryInput;

final class InteractionViewSql implements InteractionViewInterface
{
    const SELECT_INTERACTION_SQL = <<<SQL
        SELECT * FROM interactions WHERE id = ?
    SQL;

    const SELECT_TAXON_SQL = <<<SQL
        SELECT * FROM taxonomy WHERE ncbi_taxon_id = ?
    SQL;

    const SELECT_HUMAN_PROTEINS_SQL = <<<SQL
        SELECT p.id
        FROM proteins AS p, proteins_xrefs AS x
        WHERE p.id = x.protein_id AND x.ref = ANY (?::text[])
    SQL;

    const SELECT_VIRAL_PROTEINS_SQL = <<<SQL
        SELECT p.id
        FROM proteins AS p, taxonomy AS t
        WHERE p.ncbi_taxon_id = t.ncbi_taxon_id
        AND t.left_value >= ?
        AND t.right_value <= ?
        AND (? OR p.name = ANY (?::text[]))
    SQL;

    const SELECT_HH_INTERACTIONS_SQL = <<<SQL
        SELECT DISTINCT i.id, i.type, i.nb_publications, i.nb_methods,
            p1.id AS id1, p1.type AS type1, p1.accession AS accession1, p1.name AS name1, p1.description AS description1,
            p2.id AS id2, p2.type AS type2, p2.accession AS accession2, p2.name AS name2, p2.description AS description2
        FROM edges AS e, interactions AS i, proteins AS p1, proteins AS p2
        WHERE i.id = e.interaction_id
        AND p1.id = i.protein1_id
        AND p2.id = i.protein2_id
        AND i.type = 'hh'
        AND i.nb_publications >= ?
        AND i.nb_methods >= ?
        AND e.source_id = ANY (?::int[]) AND (? OR e.target_id = ANY (?::int[]))
        ORDER BY i.id ASC
    SQL;

    const SELECT_VH_INTERACTIONS_SQL = <<<SQL
        SELECT DISTINCT i.id, i.type, i.nb_publications, i.nb_methods,
            p1.id AS id1, p1.type AS type1, p1.accession AS accession1, p1.name AS name1, p1.description AS description1,
            p2.id AS id2, p2.type AS type2, p2.accession AS accession2, p2.name AS name2, p2.description AS description2,
            t.ncbi_taxon_id, t.name AS taxon_name,
            s.ncbi_taxon_id AS ncbi_species_id, s.name AS species_name
        FROM interactions AS i, proteins AS p1, proteins AS p2, taxonomy AS t, taxonomy AS s
        WHERE i.type = 'vh'
        AND p1.id = i.protein1_id
        AND p2.id = i.protein2_id
        AND t.ncbi_taxon_id = p2.ncbi_taxon_id
        AND s.ncbi_taxon_id = t.ncbi_species_id
        AND i.nb_publications >= ?
        AND i.nb_methods >= ?
        AND (? OR p1.id = ANY (?::int[]))
        AND (? OR p2.id = ANY (?::int[]))
        ORDER BY i.id ASC
    SQL;

    public function __construct(
        private \PDO $pdo,
    ) {}

    public function id(int $id): Statement
    {
        $select_interaction_sth = $this->pdo->prepare(self::SELECT_INTERACTION_SQL);

        $select_interaction_sth->execute([$id]);

        return Statement::from($select_interaction_sth);
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

        $select_proteins_sth = $this->pdo->prepare(self::SELECT_HUMAN_PROTEINS_SQL);

        $select_proteins_sth->execute(['{' . implode(',', $identifiers) . '}']);

        return ($proteins = $select_proteins_sth->fetchAll(\PDO::FETCH_COLUMN))
            ? $proteins
            : throw new Exception('fetchall ?');
    }

    private function viralProteinIds(int $ncbi_taxon_id, string ...$names): array
    {
        if ($ncbi_taxon_id < 1) {
            return [];
        }

        $select_taxon_sth = $this->pdo->prepare(self::SELECT_TAXON_SQL);

        $select_taxon_sth->execute([$ncbi_taxon_id]);

        $taxon = $select_taxon_sth->fetch();

        if (!$taxon) {
            return [];
        }

        $select_proteins_sth = $this->pdo->prepare(self::SELECT_VIRAL_PROTEINS_SQL);

        $select_proteins_sth->execute([
            $taxon['left_value'],
            $taxon['right_value'],
            (int) (count($names) == 0),
            '{' . implode(',', ($names)) . '}',
        ]);

        return ($proteins = $select_proteins_sth->fetchAll(\PDO::FETCH_COLUMN))
            ? $proteins
            : throw new Exception('fetchall ?');
    }

    private function HHInteractions(array $ids, int $nb_publications, int $nb_methods, bool $neighbors): iterable
    {
        if (count($ids) == 0) {
            return [];
        }

        $select_interactions_sth = $this->pdo->prepare(self::SELECT_HH_INTERACTIONS_SQL);

        $select_interactions_sth->execute([
            $nb_publications,
            $nb_methods,
            '{' . implode(',', $ids) . '}',
            (int) $neighbors,
            '{' . implode(',', $ids) . '}',
        ]);

        return $this->generator($select_interactions_sth);
    }

    private function VHInteractions(array $idhs, array $idvs, int $ncbi_taxon_id, int $nb_publications, int $nb_methods): iterable
    {
        if ((count($idhs) == 0 || $ncbi_taxon_id > 0) && count($idvs) == 0) {
            return [];
        }

        $select_interactions_sth = $this->pdo->prepare(self::SELECT_VH_INTERACTIONS_SQL);

        $select_interactions_sth->execute([
            $nb_publications,
            $nb_methods,
            (int) (count($idhs) == 0),
            '{' . implode(',', $idhs) . '}',
            (int) (count($idvs) == 0),
            '{' . implode(',', $idvs) . '}',
        ]);

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
