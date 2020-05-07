<?php declare(strict_types=1);

namespace App\Validations;

use Quanta\Validation\Is;
use Quanta\Validation\Field;
use Quanta\Validation\Merged;
use Quanta\Validation\InputInterface;
use Quanta\Validation\Rules\OfType;
use Quanta\Validation\Rules\Matching;
use Quanta\Validation\Rules\GreaterThan;

final class IsQuery
{
    private const KEY_PATTERN = '/^[a-z0-9]{32}$/i';

    public static function validation(): callable
    {
        $isArr = new Is(new OfType('array'));
        $isStr = new Is(new OfType('string'));
        $isInt = new Is(new OfType('integer'));
        $isBool = new Is(new OfType('boolean'));
        $isGte0 = new Is(new GreaterThan(0));
        $isGte1 = new Is(new GreaterThan(1));
        $isKey = new Is(new Matching(self::KEY_PATTERN));

        return new Merged(
            Field::required('key', $isStr, $isKey),
            Field::required('identifiers', Query\IsIdentifierList::validation()),
            Field::required('ncbi_taxon_id', $isInt, $isGte0),
            Field::required('names', Query\IsNameList::validation()),
            Field::required('neighbors', $isBool),
            Field::required('hh', $isBool),
            Field::required('vh', $isBool),
            Field::required('publications', $isInt, $isGte1),
            Field::required('methods', $isInt, $isGte1),
        );
    }
}
