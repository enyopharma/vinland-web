<?php

declare(strict_types=1);

namespace App\Input;

use Quanta\Validation;
use Quanta\Validation\Error;
use Quanta\Validation\Factory;
use Quanta\Validation\AbstractInput;
use Quanta\Validation\InvalidDataException;

final class InteractionQueryInput extends AbstractInput
{
    private const KEY_PATTERN = '/^[a-z0-9]{32}$/i';

    private const MAX_ID_THRESHOLD = 500;

    protected static function validation(Factory $factory, Validation $v): Factory
    {
        return $factory->validation(
            $v->key('key')->string(),
            $v->key('identifiers')->array(),
            $v->key('ncbi_taxon_id')->int(),
            $v->key('names')->array(),
            $v->key('publications')->int(),
            $v->key('methods')->int(),
            $v->key('hh')->bool(),
            $v->key('vh')->bool(),
            $v->key('neighbors')->bool(),
            $v->key('is_gold')->bool(),
            $v->key('is_binary')->bool(),
        );
    }

    private string $key;

    private array $identifiers;

    private int $ncbi_taxon_id;

    private array $names;

    private int $publications;

    private int $methods;

    public function __construct(
        string $key,
        array $identifiers,
        int $ncbi_taxon_id,
        array $names,
        int $publications,
        int $methods,
        private bool $hh,
        private bool $vh,
        private bool $neighbors,
        private bool $is_gold,
        private bool $is_binary,
    ) {
        $errors = [];

        if (preg_match(self::KEY_PATTERN, $key) === 0) {
            $errors[] = Error::from(sprintf('key must match %s', self::KEY_PATTERN));
        }

        if (count($identifiers) > count(array_filter($identifiers, 'is_string'))) {
            $errors[] = Error::from('identifiers must be strings');
        } elseif (count($identifiers) > self::MAX_ID_THRESHOLD) {
            $errors[] = Error::from(sprintf('identifiers must be %s unique max', self::MAX_ID_THRESHOLD));
        }

        if ($ncbi_taxon_id < 0) {
            $errors[] = Error::from('ncbi_taxon_id must be positive');
        }

        if (count($names) > count(array_filter($names, 'is_string'))) {
            $errors[] = Error::from('names must be strings');
        }

        if ($publications < 1) {
            $errors[] = Error::from('publications must be greater than 0');
        }

        if ($methods < 1) {
            $errors[] = Error::from('methods must be greater than 0');
        }

        if (count($errors) > 0) {
            throw new InvalidDataException(...$errors);
        }

        $this->key = $key;
        $this->identifiers = array_unique(array_map('strtoupper', $identifiers));
        $this->ncbi_taxon_id = $ncbi_taxon_id;
        $this->names = array_unique($names);
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

    public function hh(): bool
    {
        return $this->hh;
    }

    public function vh(): bool
    {
        return $this->vh;
    }

    public function neighbors(): bool
    {
        return $this->neighbors;
    }

    public function filters(): array
    {
        return [$this->publications, $this->methods, $this->is_gold, $this->is_binary];
    }
}
