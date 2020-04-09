<?php declare(strict_types=1);

namespace App\Request;

use Quanta\Validation\Bound;
use Quanta\Validation\Success;
use Quanta\Validation\InputInterface;

use App\Validations\IsQuery;

final class QueryInput
{
    private string $key;
    private array $identifiers;
    private int $ncbi_taxon_id;
    private array $names;
    private bool $hh;
    private bool $vh;
    private bool $neighbors;
    private int $publications;
    private int $methods;

    public static function from(array $data): InputInterface
    {
        return isQuery::validation()($data)->bind(fn (array $data) => new Success(new self($data)));
    }

    private function __construct(array $data)
    {
        $this->key = $data['key'];
        $this->identifiers = $data['identifiers'];
        $this->ncbi_taxon_id = $data['ncbi_taxon_id'];
        $this->names = $data['names'];
        $this->hh = $data['hh'];
        $this->vh = $data['vh'];
        $this->neighbors = $data['neighbors'];
        $this->publications = $data['publications'];
        $this->methods = $data['methods'];
    }

    public function key(): string
    {
        return $this->key;
    }

    public function isComplete(): bool
    {
        return count($this->identifiers) > 0 || $this->ncbi_taxon_id > 0;
    }

    public function human(): array
    {
        return [$this->identifiers];
    }

    public function virus(): array
    {
        return [$this->ncbi_taxon_id, $this->names];
    }

    public function neighbors(): bool
    {
        return $this->neighbors;
    }

    public function hh(): bool
    {
        return $this->hh;
    }

    public function vh(): bool
    {
        return $this->vh;
    }

    public function filters(): array
    {
        return [$this->publications, $this->methods];
    }
}
