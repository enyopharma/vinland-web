<?php

declare(strict_types=1);

namespace App\ReadModel;

final class InteractorViewSql implements InteractorViewInterface
{
    const SELECT_H_INTERACTORS_SQL = <<<SQL
        SELECT i.id, i.type, p.id AS protein_id, p.type AS protein_type, p.accession, p.name, p.description, 'Homo sapiens' AS taxon
        FROM interactions AS i, edges AS e, proteins AS p
        WHERE p.type = 'h'
        AND i.id = e.interaction_id
        AND p.id = e.target_id
        AND e.source_id = ?
    SQL;

    const SELECT_V_INTERACTORS_SQL = <<<SQL
        SELECT
            i.id, i.type,
            p.id AS protein_id, p.type AS protein_type, p.accession, p.name, p.description,
            t.name AS taxon
        FROM interactions AS i, edges AS e, proteins AS p, taxonomy AS t
        WHERE p.type = 'v'
        AND i.id = e.interaction_id
        AND p.id = e.target_id
        AND p.ncbi_taxon_id = t.ncbi_taxon_id
        AND e.source_id = ?
    SQL;

    const SELECT_MAPPINGS_SQL = <<<SQL
        SELECT DISTINCT e.interaction_id, m.sequence_id, m.start, m.stop, m.sequence
        FROM proteins AS p, edges AS e, mappings AS m
        WHERE p.type = ?
        AND p.id = e.target_id
        AND e.id = m.edge_id
        AND e.source_id = ?
    SQL;

    public function __construct(
        private \PDO $pdo,
    ) {
    }

    public function all(string $type, int $protein_id): Statement
    {
        $select_interactors_sth = $type == 'h'
            ? $this->pdo->prepare(self::SELECT_H_INTERACTORS_SQL)
            : $this->pdo->prepare(self::SELECT_V_INTERACTORS_SQL);

        $select_interactors_sth->execute([$protein_id]);

        $select_mappings_sth = $this->pdo->prepare(self::SELECT_MAPPINGS_SQL);

        $select_mappings_sth->execute([$type, $protein_id]);

        $mappings = $select_mappings_sth->fetchAll();

        return Statement::from($this->generator($select_interactors_sth, $mappings));
    }

    private function generator(iterable $rows, array $mappings): \Generator
    {
        foreach ($rows as $row) {
            yield [
                'interaction' => [
                    'id' => $row['id'],
                    'type' => $row['type'],
                ],
                'protein' => [
                    'id' => $row['protein_id'],
                    'type' => $row['protein_type'],
                    'accession' => $row['accession'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'taxon' => $row['taxon'],
                ],
                'mappings' => array_values(array_filter($mappings, function (array $mapping) use ($row) {
                    return $row['id'] == $mapping['interaction_id'];
                })),
            ];
        }
    }
}
