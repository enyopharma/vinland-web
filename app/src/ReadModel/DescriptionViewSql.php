<?php

declare(strict_types=1);

namespace App\ReadModel;

final class DescriptionViewSql implements DescriptionViewInterface
{
    const SELECT_DESCRIPTIONS_SQL = <<<SQL
        SELECT d.id, p.pmid, p.title, p.year, m.psimi_id
        FROM descriptions AS d, publications AS p, methods AS m
        WHERE d.interaction_id = ?
        AND p.pmid = d.pmid
        AND m.id = d.method_id
    SQL;

    const SELECT_MAPPINGS_SQL = <<<SQL
        SELECT DISTINCT m.description_id, m.start, m.stop, m.identity, m.sequence
        FROM edges AS e, mappings AS m
        WHERE e.id = m.edge_id
        AND e.interaction_id = ?
        AND m.sequence_id = ?
    SQL;

    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all(int $interaction_id, int $isoform1_id, int $isoform2_id): Statement
    {
        $select_descriptions_sth = $this->pdo->prepare(self::SELECT_DESCRIPTIONS_SQL);
        $select_mappings_sth = $this->pdo->prepare(self::SELECT_MAPPINGS_SQL);

        $select_descriptions_sth->execute([$interaction_id]);

        $select_mappings_sth->execute([$interaction_id, $isoform1_id]);

        $mappings1 = $select_mappings_sth->fetchAll();

        $select_mappings_sth->execute([$interaction_id, $isoform2_id]);

        $mappings2 = $select_mappings_sth->fetchAll();

        if ($mappings1 === false || $mappings2 === false) {
            throw new \LogicException;
        }

        return Statement::from($this->generator($select_descriptions_sth, $mappings1, $mappings2));
    }

    private function generator(iterable $rows, array $mappings1, array $mappings2): \Generator
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
                ],
                'mappings1' => array_values(array_filter($mappings1, function (array $mapping) use ($row) {
                    return $row['id'] == $mapping['description_id'];
                })),
                'mappings2' => array_values(array_filter($mappings2, function (array $mapping) use ($row) {
                    return $row['id'] == $mapping['description_id'];
                })),
            ];
        }
    }
}
