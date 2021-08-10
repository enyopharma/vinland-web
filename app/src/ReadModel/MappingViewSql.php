<?php

declare(strict_types=1);

namespace App\ReadModel;

final class MappingViewSql implements MappingViewInterface
{
    const SELECT_TARGETING_MAPPING_SQL = <<<SQL
        SELECT i.id AS interaction_id, i.type AS itype,
        p.id AS protein_id, p.type AS ptype, s.accession, p.name, m.sequence,
        t.ncbi_taxon_id, t.name AS taxon
        FROM mappings AS m,
            edges AS e,
            interactions AS i,
            sequences AS s,
            proteins AS p LEFT JOIN taxonomy AS t ON p.ncbi_taxon_id = t.ncbi_taxon_id
        WHERE e.id = m.edge_id
        AND i.id = e.interaction_id
        AND s.id = m.sequence_id
        AND p.id = s.protein_id
        AND e.target_id = ?
        GROUP BY i.id, i.type, p.id, p.type, s.accession, p.name, m.sequence, t.ncbi_taxon_id, t.name
    SQL;

    public function __construct(private \PDO $pdo)
    {
    }

    public function targeting(int $protein_id, int $length): Statement
    {
        $select_targeting_mappings_sth = $this->pdo->prepare(self::SELECT_TARGETING_MAPPING_SQL);

        $select_targeting_mappings_sth->execute([$protein_id]);

        return Statement::from($this->generator($select_targeting_mappings_sth, $length));
    }

    private function generator(\PDOStatement $sth, int $length): \Generator
    {
        while ($row = $sth->fetch()) {
            if ($length == 0 || strlen($row['sequence']) <= $length) {
                yield [
                    'sequence' => $row['sequence'],
                    'interaction' => [
                        'id' => $row['interaction_id'],
                        'type' => $row['itype'],
                    ],
                    'source' => [
                        'id' => $row['protein_id'],
                        'type' => $row['ptype'],
                        'accession' => $row['accession'],
                        'name' => $row['name'],
                        'ncbi_taxon_id' => $row['ptype'] == 'h' ? 9606 : $row['ncbi_taxon_id'],
                        'taxon' => $row['ptype'] == 'h' ? 'Homo sapiens' : $row['taxon'],
                    ]
                ];
            }
        }
    }
}
