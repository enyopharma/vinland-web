<?php

declare(strict_types=1);

namespace App\ReadModel;

final class AnnotationViewSql implements AnnotationViewInterface
{
    private \PDO $pdo;

    const SELECT_ANNOTATIONS_SQL = <<<SQL
        SELECT * FROM annotations WHERE source = ? AND %s LIMIT ?
    SQL;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all(string $source, string $query, int $limit): Statement
    {
        $qs = explode('+', $query);
        $qs = array_map('trim', $qs);
        $qs = array_filter($qs, fn ($q) => strlen($q) > 2);
        $qs = array_map(fn ($q) => '%' . $q . '%', $qs);

        if (count($qs) == 0) {
            return Statement::from([]);
        }

        $where = implode(' AND ', array_pad([], count($qs), 'search ILIKE ?'));

        $select_annotations_sth = $this->pdo->prepare(sprintf(self::SELECT_ANNOTATIONS_SQL, $where));

        $select_annotations_sth->execute([$source, ...$qs, $limit]);

        return Statement::from($this->generator($select_annotations_sth));
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
