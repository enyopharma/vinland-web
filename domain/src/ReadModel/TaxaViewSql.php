<?php

declare(strict_types=1);

namespace Domain\ReadModel;

final class TaxaViewSql implements TaxaViewInterface
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all(string $query, int $limit): Statement
    {
        $qs = array_map(fn ($q) => '%' . trim($q) . '%', array_filter(explode('+', $query)));

        $select_taxa_sth = Query::instance($this->pdo)
            ->select('t.taxon_id, t.left_value, t.right_value, ts.name')
            ->from('taxon AS t, taxon_search AS ts')
            ->where('t.taxon_id = ts.taxon_id')
            ->where(...array_pad([], count($qs), 'ts.name ILIKE ?'))
            ->orderby('nb_interactions DESC')
            ->sliced()
            ->prepare();

        $select_taxa_sth->execute([...$qs, ...[$limit, 0]]);

        return new Statement($this->generator($select_taxa_sth));
    }

    private function generator(\PDOStatement $sth): \Generator
    {
        while ($taxon = $sth->fetch()) {
            yield [
                'id' => $taxon['taxon_id'],
                'left' => $taxon['left_value'],
                'right' => $taxon['right_value'],
                'name' => $taxon['name'],
            ];
        }
    }
}
