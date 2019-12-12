<?php

declare(strict_types=1);

namespace App\Http\Validations;

use Psr\Http\Message\ServerRequestInterface;

use Quanta\Validation\InputInterface;

final class RequestToQuery
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function input(ServerRequestInterface $request): InputInterface
    {
        return \Domain\Input\QueryInput::from($this->pdo, (array) $request->getParsedBody());
    }
}
