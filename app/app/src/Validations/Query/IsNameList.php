<?php declare(strict_types=1);

namespace App\Validations\Query;

use Quanta\Validation\Is;
use Quanta\Validation\Bound;
use Quanta\Validation\TraverseA;
use Quanta\Validation\Rules\OfType;

final class IsNameList
{
    public static function validation(): callable
    {
        $isArr = new Is(new OfType('array'));
        $isStr = new Is(new OfType('string'));
        $sanitize = StringSanitization::forceUpper(false);

        return new Bound($isArr, new TraverseA($isStr), $sanitize);
    }
}
