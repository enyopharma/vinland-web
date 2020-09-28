<?php declare(strict_types=1);

namespace App\Input;

use Quanta\Validation;
use Quanta\Validation\Error;
use Quanta\Validation\Guard;
use Quanta\Validation\Field;
use Quanta\Validation\InvalidDataException;
use Quanta\Validation\Rules\OfType;

final class InteractionQueryInput
{
    private const KEY_PATTERN = '/^[a-z0-9]{32}$/i';

    private const MAX_ID_THRESHOLD = 500;

    private string $key;
    private array $identifiers;
    private int $ncbi_taxon_id;
    private array $names;
    private bool $hh;
    private bool $vh;
    private bool $neighbors;
    private int $publications;
    private int $methods;

    public static function factory(): callable
    {
        return ArrayValidation::rules([self::class, 'from'], [
            'key' => 'string',
        ]);

        return new Validation([self::class, 'from'],
            Field::required('key', new Guard(new OfType('string')))->focus(),
            Field::required('identifiers', new Guard(new OfType('array')))->focus(),
            Field::required('ncbi_taxon_id', new Guard(new OfType('integer')))->focus(),
            Field::required('names', new Guard(new OfType('array')))->focus(),
            Field::required('hh', new Guard(new OfType('boolean')))->focus(),
            Field::required('vh', new Guard(new OfType('boolean')))->focus(),
            Field::required('neighbors', new Guard(new OfType('boolean')))->focus(),
            Field::required('publications', new Guard(new OfType('integer')))->focus(),
            Field::required('methods', new Guard(new OfType('integer')))->focus(),
        );
    }

    public function from(
        string $key,
        array $identifiers,
        int $ncbi_taxon_id,
        array $names,
        bool $hh,
        bool $vh,
        bool $neighbors,
        int $publications,
        int $methods
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
        string $key,
        array $identifiers,
        int $ncbi_taxon_id,
        array $names,
        bool $hh,
        bool $vh,
        bool $neighbors,
        int $publications,
        int $methods
    ) {
        $this->key = $key;
        $this->identifiers = $identifiers;
        $this->ncbi_taxon_id = $ncbi_taxon_id;
        $this->names = $names;
        $this->hh = $hh;
        $this->vh = $vh;
        $this->neighbors = $neighbors;
        $this->publications = $publications;
        $this->methods = $methods;
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

    private function validate(array $raw_identifiers, array $raw_names): array
    {
        $errors = [];

        if (preg_match(self::KEY_PATTERN, $this->key) === 0) {
            $errors[] = (new Error(sprintf('must match %s', self::KEY_PATTERN)))->nest('key');
        }

        if (count($raw_identifiers) > count(array_filter($raw_identifiers, 'is_string'))) {
            $errors[] = (new Error('must be strings'))->nest('identifiers');
        } elseif (count($this->identifiers) > self::MAX_ID_THRESHOLD) {
            $errors[] = (new Error(sprintf('must be %s unique max', self::MAX_ID_THRESHOLD)))->nest('identifiers');
        }

        if ($this->ncbi_taxon_id < 0) {
            $errors[] = (new Error('must be positive'))->nest('ncbi_taxon_id');
        }

        if (count($raw_names) > count(array_filter($raw_names, 'is_string'))) {
            $errors[] = (new Error('must be strings'))->nest('names');
        }

        if ($this->publications < 1) {
            $errors[] = (new Error('must be greater than 0'))->nest('publications');
        }

        if ($this->methods < 1) {
            $errors[] = (new Error('must be greater than 0'))->nest('methods');
        }

        return $errors;
    }
}
