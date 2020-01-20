<?php declare(strict_types=1);

namespace Domain\Input;

use Quanta\Validation\Bound;
use Quanta\Validation\Success;
use Quanta\Validation\InputInterface;

use Domain\Validations\IsQuery;

final class QueryInput
{
    private string $key;
    private array $human;
    private array $virus;
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
        $this->human = $data['human'];
        $this->virus = $data['virus'];
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
        return count($this->human['identifiers']) > 0 || $this->virus['ncbi_taxon_id'] > 0;
    }

    public function human(): array
    {
        return $this->human['identifiers'];
    }

    public function virus(): array
    {
        return [$this->virus['ncbi_taxon_id'], ...$this->virus['names']];
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
