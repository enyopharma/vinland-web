<?php

declare(strict_types=1);

namespace App\ReadModel;

final class IsoformViewSql implements IsoformViewInterface
{
    private \PDO $pdo;

    const SELECT_ISOFORM_SQL = <<<SQL
        SELECT *
        FROM sequences
        WHERE protein_id = ? AND id = ?
    SQL;

    const SELECT_INTERACTIONS_SQL = <<<SQL
        SELECT
            i.id, i.type,
            p.id AS protein_id, p.type AS protein_type, p.accession, p.name, p.description,
            COALESCE(t.name, 'Homo sapiens') AS taxon
        FROM interactions AS i, edges AS e, proteins AS p LEFT JOIN taxonomy AS t ON p.ncbi_taxon_id = t.ncbi_taxon_id
        WHERE i.type = ?
        AND i.id = e.interaction_id
        AND p.id = e.target_id
        AND e.source_id = ?
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

    public function id(int $protein_id, int $id, string ...$with): Statement
    {
        $select_isoform_sth = $this->pdo->prepare(self::SELECT_ISOFORM_SQL);

        $select_isoform_sth->execute([$protein_id, $id]);

        if (!$isoform = $select_isoform_sth->fetch()) {
            return Statement::from([]);
        }

        if (in_array('interactions', $with)) {
            $isoform['interactions'] = [
                'hh' => $this->interactions('hh', $protein_id, $id),
                'vh' => $this->interactions('vh', $protein_id, $id),
            ];
        }

        return Statement::from([$isoform]);
    }

    private function interactions(string $type, int $protein_id, int $isoform_id): array
    {
        $select_interactions_sth = $this->pdo->prepare(self::SELECT_INTERACTIONS_SQL);
        $select_mappings_sth = $this->pdo->prepare(self::SELECT_MAPPINGS_SQL);

        $select_interactions_sth->execute([$type, $protein_id]);
        $select_mappings_sth->execute([$type, $protein_id, $isoform_id]);

        $mappings = $select_mappings_sth->fetchAll();

        if ($mappings === false) {
            throw new \LogicException;
        }

        return iterator_to_array($this->merge($select_interactions_sth, $mappings));
    }

    private function merge(iterable $rows, array $mappings): \Generator
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
                'mappings' => array_values(array_filter($mappings, function (array $mapping) use ($row) {
                    return $row['id'] == $mapping['interaction_id'];
                })),
            ];
        }
    }
}
