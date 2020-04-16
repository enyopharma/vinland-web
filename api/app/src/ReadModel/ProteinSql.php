<?php

declare(strict_types=1);

namespace App\ReadModel;

final class ProteinSql implements ProteinInterface
{
    private \PDO $pdo;

    private int $id;

    private string $type;

    private int $ncbi_taxon_id;

    private string $accession;

    private string $name;

    private array $data;

    const SELECT_ISOFORMS_SQL = <<<SQL
        SELECT id, accession, is_canonical, is_mature, start, stop
        FROM sequences
        WHERE protein_id = ?
        ORDER BY id ASC
    SQL;

    public function __construct(
        \PDO $pdo,
        int $id,
        string $type,
        int $ncbi_taxon_id,
        string $accession,
        string $name,
        array $data = []
    ) {
        $this->pdo = $pdo;
        $this->id = $id;
        $this->type = $type;
        $this->ncbi_taxon_id = $ncbi_taxon_id;
        $this->accession = $accession;
        $this->name = $name;
        $this->data = $data;
    }

    public function data(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'ncbi_taxon_id' => $this->ncbi_taxon_id,
            'accession' => $this->accession,
            'name' => $this->name,
        ] + $this->data;
    }

    public function isoforms(): IsoformViewInterface
    {
        return new IsoformViewSql($this->pdo, $this->id);
    }

    public function withIsoforms(): self
    {
        $select_isoforms_sth = $this->pdo->prepare(self::SELECT_ISOFORMS_SQL);

        $select_isoforms_sth->execute([$this->id]);

        if (! $isoforms = $select_isoforms_sth->fetchAll()) {
            throw new \LogicException;
        }

        return new self(
            $this->pdo,
            $this->id,
            $this->type,
            $this->ncbi_taxon_id,
            $this->accession,
            $this->name,
            $this->data + ['isoforms' => $isoforms],
        );
    }
}
