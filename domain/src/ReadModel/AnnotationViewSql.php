<?php

declare(strict_types=1);

namespace Domain\ReadModel;

final class AnnotationViewSql implements AnnotationViewInterface
{
    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all(string $source, string $query, int $limit): Statement
    {
        $qs = array_map(fn ($q) => '%' . trim($q) . '%', array_filter(explode('+', $query)));

        $select_annotations_sth = Query::instance($this->pdo)
            ->select('ref, name, accessions')
            ->from('annotations AS a')
            ->where('source = ?')
            ->where(...array_pad([], count($qs), 'search ILIKE ?'))
            ->sliced()
            ->prepare();

        $select_annotations_sth->execute([$source, ...$qs, ...[$limit, 0]]);

        return new Statement($this->generator($select_annotations_sth));
    }

    private function generator(\PDOStatement $sth): \Generator
    {
        while ($annotation = $sth->fetch()) {
            yield [
                'ref' => $annotation['ref'],
                'name' => $annotation['name'],
                'accessions' => explode(',', trim($annotation['accessions'], '{}')),
            ];
        }
    }
}
