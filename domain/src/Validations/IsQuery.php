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

    public static function validation(): callable
    {
        $isArr = new Is(new OfType('array'));
        $isStr = new Is(new OfType('string'));
        $isInt = new Is(new OfType('integer'));
        $isBool = new Is(new OfType('boolean'));
        $isKey = new Bound($isStr, new Is(new Matching(self::KEY_PATTERN)));
        $isThreshold = new Bound($isInt, new Is(new GreaterThan(1)));

        return new Merged(
            Field::required('key', $isKey),
            Field::required('human', $isArr, Query\IsHumanParams::validation()),
            Field::required('virus', $isArr, Query\IsVirusParams::validation()),
            Field::required('neighbors', $isBool),
            Field::required('hh', $isBool),
            Field::required('vh', $isBool),
            Field::required('publications', $isThreshold),
            Field::required('methods', $isThreshold),
        );
    }
}
