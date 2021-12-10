<?php

declare(strict_types=1);

namespace App\ReadModel;

interface StatViewInterface
{
    public function all(): Statement;
}
