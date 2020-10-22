<?php

declare(strict_types=1);

namespace App\ReadModel;

final class DescriptionViewSql implements DescriptionViewInterface
{
    const SELECT_DESCRIPTIONS_SQL = <<<SQL
        SELECT p.pmid, p.title, p.year, m.psimi_id
        FROM descriptions AS d, publications AS p, methods AS m
        WHERE d.interaction_id = ?
        AND p.pmid = d.pmid
        AND m.id = d.method_id
    SQL;

    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all(int $interaction_id, int $isoform1_id = null, int $isoform2_id = null): Statement
    {
        $select_descriptions_sth = $this->pdo->prepare(self::SELECT_DESCRIPTIONS_SQL);

        $select_descriptions_sth->execute([$interaction_id]);

        return Statement::from($this->generator($select_descriptions_sth));
    }

    private function generator(iterable $rows): \Generator
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
            ];
        }
    }
}
