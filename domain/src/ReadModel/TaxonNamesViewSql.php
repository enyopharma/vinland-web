<?php

declare(strict_types=1);

namespace Domain\ReadModel;

use Domain\Input\TaxonInput;

final class TaxonNamesViewSql implements TaxonNamesViewInterface
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all(TaxonInput $input): Statement
    {
        $select_names_sth = Query::instance($this->pdo)
            ->select('DISTINCT p.name')
            ->from('taxon AS t, proteins AS p')
            ->where('t.ncbi_taxon_id = p.ncbi_taxon_id')
            ->where('t.left_value >= ? AND t.right_value <= ?')
            ->prepare();

        $select_names_sth->execute([$input->left(), $input->right()]);

        return new Statement($this->generator($select_names_sth));
    }

    private function generator(\PDOStatement $sth): \Generator
    {
        while ($row = $sth->fetch()) {
            yield $row['name'];
        }
    }
}
