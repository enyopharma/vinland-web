<?php

declare(strict_types=1);

namespace Domain\ReadModel;

final class TaxonSql implements TaxonInterface
{
    private \PDO $pdo;

    private int $taxon_id;

    private int $ncbi_taxon_id;

    private int $left_value;

    private int $right_value;

    private string $name;

    private array $data;

    const SELECT_PARENT_SQL = <<< SQL
        SELECT p.ncbi_taxon_id, p.name, p.nb_interactions
        FROM taxa AS t, taxa AS p
        WHERE p.taxon_id = t.parent_taxon_id
        AND t.taxon_id = ?
    SQL;

    const SELECT_CHILDREN_SQL = <<<SQL
        SELECT ncbi_taxon_id, name, nb_interactions
        FROM taxa
        WHERE nb_interactions > 0
        AND parent_taxon_id = ?
        ORDER BY nb_interactions DESC
    SQL;

    const SELECT_NAMES_SQL = <<<SQL
        SELECT DISTINCT p.name
        FROM taxa AS t, proteins AS p
        WHERE t.ncbi_taxon_id = p.ncbi_taxon_id
        AND t.left_value >= ?
        AND t.right_value <= ?
    SQL;

    public function __construct(
        \PDO $pdo,
        int $taxon_id,
        int $ncbi_taxon_id,
        int $left_value,
        int $right_value,
        string $name,
        array $data = []
    ) {
        $this->pdo = $pdo;
        $this->taxon_id = $taxon_id;
        $this->ncbi_taxon_id = $ncbi_taxon_id;
        $this->left_value = $left_value;
        $this->right_value = $right_value;
        $this->name = $name;
        $this->data = $data;
    }

    public function data(): array
    {
        return [
            'taxon_id' => $this->taxon_id,
            'ncbi_taxon_id' => $this->ncbi_taxon_id,
            'name' => $this->name,
        ] + $this->data;
    }

    public function withRelated(): self
    {
        $select_parent_sth = $this->pdo->prepare(self::SELECT_PARENT_SQL);

        $select_parent_sth->execute([$this->taxon_id]);

        if (! $parent = $select_parent_sth->fetch()) {
            $parent = null;
        }

        $select_children_sth = $this->pdo->prepare(self::SELECT_CHILDREN_SQL);

        $select_children_sth->execute([$this->taxon_id]);

        $children = $select_children_sth->fetchAll();

        if ($children === false) {
            throw new \LogicException;
        }

        return new self(
            $this->pdo,
            $this->taxon_id,
            $this->ncbi_taxon_id,
            $this->left_value,
            $this->right_value,
            $this->name,
            $this->data + [
                'parent' => $parent,
                'children' => $children,
            ],
        );
    }

    public function withNames(): self
    {
        $select_names_sth = $this->pdo->prepare(self::SELECT_NAMES_SQL);

        $select_names_sth->execute([$this->left_value, $this->right_value]);

        $names = $select_names_sth->fetchAll(\PDO::FETCH_COLUMN);

        if ($names === false) {
            throw new \LogicException;
        }

        return new self(
            $this->pdo,
            $this->taxon_id,
            $this->ncbi_taxon_id,
            $this->left_value,
            $this->right_value,
            $this->name,
            $this->data + [
                'names' => $names,
            ],
        );
    }
}
