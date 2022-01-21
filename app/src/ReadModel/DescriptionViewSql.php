<?php

declare(strict_types=1);

namespace App\ReadModel;

final class DescriptionViewSql implements DescriptionViewInterface
{
    const SELECT_DESCRIPTIONS_SQL = <<<SQL
        SELECT d.id, p.pmid, p.title, p.year, m.psimi_id, m.name
        FROM descriptions AS d, publications AS p, methods AS m
        WHERE d.interaction_id = ?
        AND p.pmid = d.pmid
        AND m.id = d.method_id
    SQL;

    const SELECT_MAPPINGS_SQL = <<<SQL
        SELECT DISTINCT m.description_id, m.sequence_id, m.start, m.stop, m.sequence
        FROM edges AS e, mappings AS m
        WHERE e.id = m.edge_id
        AND e.interaction_id = ?
    SQL;

    public function __construct(
        private \PDO $pdo,
    ) {
    }

    public function all(int $interaction_id): Statement
    {
        $select_descriptions_sth = $this->pdo->prepare(self::SELECT_DESCRIPTIONS_SQL);

        $select_descriptions_sth->execute([$interaction_id]);

        $select_mappings_sth = $this->pdo->prepare(self::SELECT_MAPPINGS_SQL);

        $select_mappings_sth->execute([$interaction_id]);

        $mappings = $select_mappings_sth->fetchAll();

        if ($mappings === false) {
            throw new \Exception('fetchall ?');
        }

        return Statement::from($this->generator($select_descriptions_sth, $mappings));
    }

    private function generator(iterable $rows, array $mappings): \Generator
    {
        foreach ($rows as $row) {
            yield [
                'publication' => [
                    'pmid' => $row['pmid'],
                    'title' => $row['title'],
                    'year' => $row['year'],
                ],
                'method' => [
                    'psimi_id' => $row['psimi_id'],
                    'name' => $row['name'],
                ],
                'mappings' => array_values(array_filter($mappings, function (array $mapping) use ($row) {
                    return $row['id'] == $mapping['description_id'];
                })),
            ];
        }
    }
}
