<?php

declare(strict_types=1);

namespace Domain\ReadModel;

final class ProteinSql implements ProteinInterface
{
    private \PDO $pdo;

    private int $id;

    private string $type;

    private int $ncbi_taxon_id;

    private string $accession;

    private string $name;

    private array $data;

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
        $this->ncbi_taxon_id = $ncbi_taxon_id;
        $this->accession = $accession;
        $this->name = $name;
        $this->data = $data;
    }

    public function data(): array
    {
        return [
            'id' => $this->id,
            'ncbi_taxon_id' => $this->ncbi_taxon_id,
            'accession' => $this->accession,
            'name' => $this->name,
        ] + $this->data;
    }
}
