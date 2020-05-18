<?php declare(strict_types=1);

namespace App\Input;

use Quanta\Validation;
use Quanta\Validation\Map;
use Quanta\Validation\Guard;
use Quanta\Validation\Field;
use Quanta\Validation\Rules\OfType;
use Quanta\Validation\Rules\Matching;
use Quanta\Validation\Rules\LessThanEqual;
use Quanta\Validation\Rules\GreaterThanEqual;

final class InteractionQueryInput
{
    private const MAX_ID_THRESHOLD = 500;

    private const KEY_PATTERN = '/^[a-z0-9]{32}$/i';

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
        $isarr = new Guard(new OfType('array'));
        $isstr = new Guard(new OfType('string'));
        $isint = new Guard(new OfType('integer'));
        $isbool = new Guard(new OfType('boolean'));
        $isgte0 = new Guard(new GreaterThanEqual(0));
        $isgte1 = new Guard(new GreaterThanEqual(1));
        $iskey = new Guard(new Matching(self::KEY_PATTERN));
        $isltemax = new Guard(new LessThanEqual(self::MAX_ID_THRESHOLD));
        $isstrlist = Map::merged($isstr);

        $factory = fn (array ...$xs) => new self(array_merge(...$xs));

        return new Validation($factory,
            Field::required('key', $isstr, $iskey),
            Field::required('identifiers', $isarr, $isstrlist, $isltemax),
            Field::required('ncbi_taxon_id', $isint, $isgte0),
            Field::required('names', $isarr, $isstrlist),
            Field::required('neighbors', $isbool),
            Field::required('hh', $isbool),
            Field::required('vh', $isbool),
            Field::required('publications', $isint, $isgte1),
            Field::required('methods', $isint, $isgte1),
        );
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
        $identifiers = array_map('strtoupper', $this->identifiers);
        $identifiers = array_unique($identifiers);

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
