<?php

declare(strict_types=1);

namespace Domain\ReadModel;

final class AnnotationViewSql implements AnnotationViewInterface
{
    private \PDO $pdo;

    const SELECT_ANNOTATIONS_SQL = <<<SQL
        SELECT * FROM annotations WHERE %s AND source = ? LIMIT ?
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

        $where = implode(' AND ', array_pad([], count($qs), 'search ILIKE ?'));

        $select_annotations_sth = $this->pdo->prepare(sprintf(self::SELECT_ANNOTATIONS_SQL, $where));

        $select_annotations_sth->execute([...$qs, $source, $limit]);

        return Statement::from($this->generator($select_annotations_sth));
    }

    private function generator(\PDOStatement $sth): \Generator
    {
        foreach ($sth as $annotation) {
            yield new Entity([
                'source' => $annotation['source'],
                'ref' => $annotation['ref'],
                'name' => $annotation['name'],
                'accessions' => explode(',', trim($annotation['accessions'], '{}')),
            ]);
        }
    }
}
