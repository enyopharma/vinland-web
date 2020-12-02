<?php declare(strict_types=1);

namespace App\Input;

use Quanta\Validation\Error;
use Quanta\Validation\Field;
use Quanta\Validation\OfType;
use Quanta\Validation\ArrayFactory;
use Quanta\Validation\InvalidDataException;

final class InteractionQueryInput
{
    private const KEY_PATTERN = '/^[a-z0-9]{32}$/i';

    private const MAX_ID_THRESHOLD = 500;

    public static function factory(): callable
    {
        $is_bln = OfType::guard('boolean');
        $is_int = OfType::guard('integer');
        $is_str = OfType::guard('string');
        $is_arr = OfType::guard('array');

        return new ArrayFactory([self::class, 'from'],
            Field::required('key', $is_str)->focus(),
            Field::required('identifiers', $is_arr)->focus(),
            Field::required('ncbi_taxon_id', $is_int)->focus(),
            Field::required('names', $is_arr)->focus(),
            Field::required('hh', $is_bln)->focus(),
            Field::required('vh', $is_bln)->focus(),
            Field::required('neighbors', $is_bln)->focus(),
            Field::required('publications', $is_int)->focus(),
            Field::required('methods', $is_int)->focus(),
        );
    }

    public static function from(
        string $key,
        array $identifiers,
        int $ncbi_taxon_id,
        array $names,
        bool $hh,
        bool $vh,
        bool $neighbors,
        int $publications,
        int $methods,
    ): self {
        $sanitized_ids = array_unique(array_map('strtoupper', array_filter($identifiers, 'is_string')));
        $sanitized_names = array_unique(array_filter($names, 'is_string'));

        $input = new self($key, $sanitized_ids, $ncbi_taxon_id, $sanitized_names, $hh, $vh, $neighbors, $publications, $methods);

        $errors = $input->validate($identifiers, $names);

        if (count($errors) == 0) {
            return $input;
        }

        throw new InvalidDataException(...$errors);
    }

    private function __construct(
        private string $key,
        private array $identifiers,
        private int $ncbi_taxon_id,
        private array $names,
        private bool $hh,
        private bool $vh,
        private bool $neighbors,
        private int $publications,
        private int $methods,
    ) {}

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

    private function validate(array $raw_identifiers, array $raw_names): array
    {
        $errors = [];

        if (preg_match(self::KEY_PATTERN, $this->key) === 0) {
            $errors[] = Error::nested('key', sprintf('must match %s', self::KEY_PATTERN));
        }

        if (count($raw_identifiers) > count(array_filter($raw_identifiers, 'is_string'))) {
            $errors[] = Error::nested('identifiers', 'must be strings');
        } elseif (count($this->identifiers) > self::MAX_ID_THRESHOLD) {
            $errors[] = Error::nested('identifiers', sprintf('must be %s unique max', self::MAX_ID_THRESHOLD));
        }

        if ($this->ncbi_taxon_id < 0) {
            $errors[] = Error::nested('ncbi_taxon_id', 'must be positive');
        }

        if (count($raw_names) > count(array_filter($raw_names, 'is_string'))) {
            $errors[] = Error::nested('names', 'must be strings');
        }

        if ($this->publications < 1) {
            $errors[] = Error::nested('publications', 'must be greater than 0');
        }

        if ($this->methods < 1) {
            $errors[] = Error::nested('methods', 'must be greater than 0');
        }

        return $errors;
    }
}
