<?php

declare(strict_types=1);

namespace App\Http\Validations;

use Psr\Http\Message\ServerRequestInterface;

use Quanta\Validation\InputInterface;

final class RequestToTaxon
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function input(ServerRequestInterface $request): InputInterface
    {
        $data['left'] = (int) $request->getAttribute('left');
        $data['right'] = (int) $request->getAttribute('right');

        return \Domain\Input\TaxonInput::from($this->pdo, $data);
    }
}
