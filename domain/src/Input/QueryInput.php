<?php declare(strict_types=1);

namespace Domain\Input;

use Quanta\Validation\Bound;
use Quanta\Validation\Success;
use Quanta\Validation\InputInterface;

use Domain\Validations\IsQuery;

final class QueryInput
{
    private const MAX_IDENTIFIERS = 500;

    private string $key;
    private array $identifiers;
    private array $taxon;
    private array $names;
    private bool $hh;
    private bool $vh;
    private bool $network;
    private int $publications;
    private int $methods;

    public static function from(\PDO $pdo, array $data): InputInterface
    {
        $validation = new Bound(
            new IsQuery($pdo, self::MAX_IDENTIFIERS),
            fn (array $data) => new Success(new self($data)),
        );

        return $validation($data);
    }

    private function __construct(array $data)
    {
        $this->key = $data['key'];
        $this->identifiers = $data['identifiers'];
        $this->taxon = $data['taxon'];
        $this->names = $data['names'];
        $this->hh = $data['hh'];
        $this->vh = $data['vh'];
        $this->network = $data['network'];
        $this->publications = $data['publications'];
        $this->methods = $data['methods'];
    }

    public function isComplete(): bool
    {
        return count($this->identifiers) > 0 || $this->taxon['left'] > 0;
    }

    public function wantsHHNetwork(): bool
    {
        return $this->hh
            && $this->network
            && count($this->identifiers) > 0;
    }

    public function wantsHHInteractions(): bool
    {
        return $this->hh
            && ! $this->network
            && count($this->identifiers) > 0;
    }

    public function wantsVHInteractions(): bool
    {
        return $this->vh;
    }

    public function human(): array
    {
        return [$this->identifiers];
    }

    public function virus(): array
    {
        return [$this->taxon['left'], $this->taxon['right'], $this->names];
    }

    public function filters(): array
    {
        return [$this->publications, $this->methods];
    }
}
