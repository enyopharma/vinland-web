<?php

declare(strict_types=1);

namespace Domain\ReadModel;

use Domain\Input\TaxonInput;

interface TaxonNamesViewInterface
{
    public function all(TaxonInput $input): Statement;
}
