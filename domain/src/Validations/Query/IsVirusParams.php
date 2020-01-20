<?php declare(strict_types=1);

namespace Domain\Validations\Query;

use Quanta\Validation\Is;
use Quanta\Validation\Field;
use Quanta\Validation\Merged;
use Quanta\Validation\TraverseA;
use Quanta\Validation\Rules\OfType;
use Quanta\Validation\Rules\GreaterThan;

final class IsVirusParams
{
    public static function validation(): callable
    {
        $isInt = new Is(new OfType('integer'));
        $isArr = new Is(new OfType('array'));
        $isStr = new Is(new OfType('string'));
        $isPos = new Is(new GreaterThan(0));
        $sanitize = StringSanitization::forceUpper(false);

        return new Merged(
            Field::required('ncbi_taxon_id', $isInt, $isPos),
            Field::required('names', $isArr, new TraverseA($isStr), $sanitize)
        );
    }
}
