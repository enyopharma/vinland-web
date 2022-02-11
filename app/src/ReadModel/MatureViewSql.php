<?php

declare(strict_types=1);

namespace App\ReadModel;

final class MatureViewSql implements MatureViewInterface
{
    const SELECT_PROTEINS_SQL = <<<SQL
        SELECT p.id, p.accession, p.name
        FROM proteins AS p, taxonomy AS t
        WHERE p.ncbi_taxon_id = t.ncbi_taxon_id
        AND t.left_value >= ?
        AND t.right_value <= ?
        GROUP BY p.id, p.name, p.accession
        ORDER BY p.name ASC, p.accession ASC
    SQL;

    public function __construct(
        private \PDO $pdo,
    ) {
    }

    public function taxon(int $left_value, int $right_value): Statement
    {
        $select_proteins_sth = $this->pdo->prepare(self::SELECT_PROTEINS_SQL);

        $select_proteins_sth->execute([$left_value, $right_value]);

        return Statement::from($this->generator($select_proteins_sth));
    }

    private function generator(iterable $rows): \Generator
    {
        $map = [];

        foreach ($rows as ['id' => $id, 'accession' => $accession, 'name' => $name]) {
            if (!array_key_exists($name, $map)) $map[$name] = [];
            array_push($map[$name], ['id' => $id, 'accession' => $accession]);
        }

        foreach ($map as $name => $proteins) {
            yield ['name' => $name, 'proteins' => $proteins];
        }
    }
}
