<?php declare(strict_types=1);

namespace App\Validations\Query;

use Quanta\Validation\Is;
use Quanta\Validation\Bound;
use Quanta\Validation\TraverseA;
use Quanta\Validation\Rules\OfType;
use Quanta\Validation\Rules\LessThan;

final class IsIdentifierList
{
    private const MAX_IDENTIFIERS = 500;

    public static function validation(): callable
    {
        $isArr = new Is(new OfType('array'));
        $isStr = new Is(new OfType('string'));
        $sanitize = StringSanitization::forceUpper(true);
        $isLessThanThreshold = new Is(new LessThan(self::MAX_IDENTIFIERS));

        return new Bound($isArr, new TraverseA($isStr), $sanitize, $isLessThanThreshold);
    }
}
