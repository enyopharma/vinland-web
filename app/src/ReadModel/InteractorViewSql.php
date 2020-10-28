<?php

declare(strict_types=1);

namespace App\ReadModel;

final class InteractorViewSql implements InteractorViewInterface
{
    private \PDO $pdo;

    const SELECT_H_INTERACTORS_SQL = <<<SQL
        SELECT
            i.id, i.type,
            p.id AS protein_id, p.type AS protein_type, p.accession, p.name, p.description,
            'Homo sapiens' AS taxon, COUNT(m.id) AS nb_mappings
        FROM
            interactions AS i,
            edges AS e LEFT JOIN mappings AS m ON e.id = m.edge_id,
            proteins AS p
        WHERE p.type = 'h'
        AND i.id = e.interaction_id
        AND p.id = e.target_id
        AND e.source_id = ?
        GROUP BY i.id, p.id
    SQL;

    const SELECT_V_INTERACTORS_SQL = <<<SQL
        SELECT
            i.id, i.type,
            p.id AS protein_id, p.type AS protein_type, p.accession, p.name, p.description,
            t.name AS taxon, COUNT(m.id) AS nb_mappings
        FROM
            interactions AS i,
            edges AS e LEFT JOIN mappings AS m ON e.id = m.edge_id,
            proteins AS p,
            taxonomy AS t
        WHERE p.type = 'v'
        AND i.id = e.interaction_id
        AND p.id = e.target_id
        AND p.ncbi_taxon_id = t.ncbi_taxon_id
        AND e.source_id = ?
        GROUP BY i.id, p.id, t.taxon_id
    SQL;

    const SELECT_MAPPINGS_SQL = <<<SQL
        SELECT DISTINCT i.id AS interaction_id, m.start, m.stop, m.identity, m.sequence
        FROM interactions AS i, edges AS e, descriptions AS d, mappings AS m
        WHERE i.type = ?
        AND i.id = d.interaction_id
        AND i.id = e.interaction_id
        AND e.id = m.edge_id
        AND d.id = m.description_id
        AND e.source_id = ?
        AND m.sequence_id = ?
    SQL;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all(string $type, int $protein_id, int $isoform_id): Statement
    {
        $select_interactors_sth = $type == 'h'
            ? $this->pdo->prepare(self::SELECT_H_INTERACTORS_SQL)
            : $this->pdo->prepare(self::SELECT_V_INTERACTORS_SQL);

        $select_interactors_sth->execute([$protein_id]);

        $select_mappings_sth = $this->pdo->prepare(self::SELECT_MAPPINGS_SQL);

        $select_mappings_sth->execute([$type, $protein_id, $isoform_id]);

        $mappings = $select_mappings_sth->fetchAll();

        if ($mappings === false) {
            throw new \LogicException;
        }

        return Statement::from($this->generator($select_interactors_sth, $mappings));
    }

    private function generator(iterable $rows, array $mappings): \Generator
    {
        foreach ($rows as $row) {
            yield [
                'id' => $row['id'],
                'type' => $row['type'],
                'protein' => [
                    'id' => $row['protein_id'],
                    'type' => $row['protein_type'],
                    'accession' => $row['accession'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'taxon' => $row['taxon'],
                ],
                'nb_mappings' => $row['nb_mappings'],
                'mappings' => array_values(array_filter($mappings, function (array $mapping) use ($row) {
                    return $row['id'] == $mapping['interaction_id'];
                })),
            ];
        }
    }
}
