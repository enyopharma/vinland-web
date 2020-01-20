<?php declare(strict_types=1);

namespace Domain\Validations\Query;

use Quanta\Validation\Is;
use Quanta\Validation\Field;
use Quanta\Validation\TraverseA;
use Quanta\Validation\Rules\OfType;
use Quanta\Validation\Rules\LessThan;

final class IsHumanParams
{
    private const MAX_IDENTIFIERS = 500;

    public static function validation(): callable
    {
        $isArr = new Is(new OfType('array'));
        $isStr = new Is(new OfType('string'));
        $sanitize = StringSanitization::forceUpper(true);
        $isLessThanThreshold = new Is(new LessThan(self::MAX_IDENTIFIERS));

        return Field::required('identifiers', $isArr, new TraverseA($isStr), $sanitize, $isLessThanThreshold);
    }
}
