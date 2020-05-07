<?php

declare(strict_types=1);

namespace App\ReadModel;

final class AnnotationViewSql implements AnnotationViewInterface
{
    private \PDO $pdo;

    const SELECT_ANNOTATIONS_SQL = <<<SQL
        SELECT *
        FROM annotations
        WHERE source = ? AND search ILIKE ALL(?)
        LIMIT ?
    SQL;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all(string $source, string $query, int $limit): Statement
    {
        $qs = array_map(fn ($q) => '%' . trim($q) . '%', array_filter(explode('+', $query)));

        if (count($qs) == 0) {
            return Statement::from([]);
        }

        $select_annotations_sth = $this->pdo->prepare(self::SELECT_ANNOTATIONS_SQL);

        $select_annotations_sth->execute([$source, '{' . implode(',', $qs) . '}', $limit]);

        $generator = $this->generator($select_annotations_sth);

        return Statement::from($generator);
    }

    private function generator(iterable $rows): \Generator
    {
        foreach ($rows as $row) {
            yield [
                'source' => $row['source'],
                'ref' => $row['ref'],
                'name' => $row['name'],
                'accessions' => explode(',', trim($row['accessions'], '{}')),
            ];
        }
    }
}
