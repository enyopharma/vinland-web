<?php declare(strict_types=1);

namespace Domain\Validations;

use Quanta\Validation\Is;
use Quanta\Validation\Bound;
use Quanta\Validation\Field;
use Quanta\Validation\Merged;
use Quanta\Validation\Success;
use Quanta\Validation\TraverseA;
use Quanta\Validation\InputInterface;
use Quanta\Validation\Rules\OfType;
use Quanta\Validation\Rules\Matching;
use Quanta\Validation\Rules\LessThan;
use Quanta\Validation\Rules\GreaterThan;

final class IsQuery
{
    private const KEY_PATTERN = '/^[a-z0-9]{32}$/i';

    private \PDO $pdo;

    private int $threshold;

    public function __construct(\PDO $pdo, int $threshold)
    {
        $this->pdo = $pdo;
        $this->threshold = $threshold;
    }

    public function __invoke(array $data): InputInterface
    {
        $upper = fn (string $str) => $this->upper($str);
        $sanitize = fn (array $strs) => $this->sanitize(...$strs);

        $isarr = new Is(new OfType('array'));
        $isstr = new Is(new OfType('string'));
        $isint = new Is(new OfType('integer'));
        $isbool = new Is(new OfType('boolean'));
        $iskey = new Bound($isstr, new Is(new Matching(self::KEY_PATTERN)));
        $istaxon = new IsTaxon($this->pdo);
        $isidentifiers = new Bound($isarr, new TraverseA($isstr, $upper), $sanitize, new Is(new LessThan($this->threshold)));
        $isnames = new Bound($isarr, new TraverseA($isstr), $sanitize);
        $isthreshold = new Bound($isint, new Is(new GreaterThan(1)));

        $validation = new Merged(
            Field::required('key', $iskey),
            Field::required('identifiers', $isidentifiers),
            Field::required('taxon', $istaxon),
            Field::required('names', $isnames),
            Field::required('hh', $isbool),
            Field::required('vh', $isbool),
            Field::required('network', $isbool),
            Field::required('publications', $isthreshold),
            Field::required('methods', $isthreshold),
        );

        return $validation($data);
    }

    private function upper(string $str): InputInterface
    {
        return new Success(strtoupper($str));
    }

    private function sanitize(string ...$strs): InputInterface
    {
        $strs = array_map('trim', $strs);
        $strs = array_unique($strs);
        $strs = array_filter($strs, fn ($str) => strlen($str) > 0);

        return new Success($strs);
    }
}
