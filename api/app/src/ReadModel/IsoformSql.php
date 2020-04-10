<?php

declare(strict_types=1);

namespace App\ReadModel;

class IsoformSql implements IsoformInterface
{
    private \PDO $pdo;

    private int $id;

    private int $protein_id;

    private string $accession;

    private string $sequence;

    private bool $is_canonical;

    private array $data;

    const SELECT_INTERACTIONS_SQL = <<<SQL
        SELECT
            i.id, i.type,
            p.id AS protein_id, p.type AS protein_type, p.accession, p.name, p.description,
            taxa.name AS taxon
        FROM interactions AS i, edges AS e, proteins AS p
        LEFT JOIN taxa ON p.ncbi_taxon_id = taxa.ncbi_taxon_id
        WHERE i.type = ?
        AND i.id = e.interaction_id
        AND p.id = e.target_id
        AND e.source_id = ?
    SQL;

    const SELECT_MAPPINGS_SQL = <<<SQL
        SELECT i.id AS interaction_id, m.start, m.stop, m.identity, m.sequence
        FROM interactions AS i, edges AS e, descriptions AS d, mappings AS m
        WHERE i.type = ?
        AND i.id = d.interaction_id
        AND i.id = e.interaction_id
        AND e.id = m.edge_id
        AND d.id = m.description_id
        AND e.source_id = ?
        AND m.sequence_id = ?
    SQL;

    public function __construct(
        \PDO $pdo,
        int $id,
        int $protein_id,
        string $accession,
        string $sequence,
        bool $is_canonical,
        array $data
    ) {
        $this->pdo = $pdo;
        $this->id = $id;
        $this->protein_id = $protein_id;
        $this->accession = $accession;
        $this->sequence = $sequence;
        $this->is_canonical = $is_canonical;
        $this->data = $data;
    }

    public function data(): array
    {
        return [
            'id' => $this->id,
            'accession' => $this->accession,
            'sequence' => $this->sequence,
            'is_canonical' => $this->is_canonical,
        ] + $this->data;
    }

    public function withInteractions(): self
    {
        $hh = $this->interactions('hh');
        $vh = $this->interactions('vh');

        return new self(
            $this->pdo,
            $this->id,
            $this->protein_id,
            $this->accession,
            $this->sequence,
            $this->is_canonical,
            $this->data + ['interactions' => ['hh' => $hh, 'vh' => $vh]],
        );
    }

    private function interactions(string $type): array
    {
        $select_interactions_sth = $this->pdo->prepare(self::SELECT_INTERACTIONS_SQL);

        $select_interactions_sth->execute([$type, $this->protein_id]);

        $select_mappings_sth = $this->pdo->prepare(self::SELECT_MAPPINGS_SQL);

        $select_mappings_sth->execute([$type, $this->protein_id, $this->id]);

        $mappings = $select_mappings_sth->fetchAll();

        if ($mappings === false) {
            throw new LogicException;
        }

        return iterator_to_array($this->merge($select_interactions_sth, $mappings));
    }

    private function merge(\PDOStatement $sth, array $mappings): \Generator
    {
        while ($row = $sth->fetch()) {
            yield [
                'id' => $row['id'],
                'type' => $row['type'],
                'protein' => [
                    'id' => $row['protein_id'],
                    'type' => $row['protein_type'],
                    'accession' => $row['accession'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'taxon' => $row['taxon'] ?? 'Homo sapiens',
                ],
                'mappings' => array_values(array_filter($mappings, function (array $mapping) use ($row) {
                    return $row['id'] == $mapping['interaction_id'];
                })),
            ];
        }
    }
}
