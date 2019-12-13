<?php declare(strict_types=1);

namespace Domain\Input;

use Quanta\Validation\Bound;
use Quanta\Validation\Success;
use Quanta\Validation\InputInterface;

use Domain\Validations\IsTaxon;

final class TaxonInput
{
    private int $left;
    private int $right;

    public static function from(\PDO $pdo, array $data): InputInterface
    {
        $validation = new Bound(
            new IsTaxon($pdo),
            fn (array $data) => new Success(new self($data)),
        );

        return $validation($data);
    }

    private function __construct(array $data)
    {
        $this->left = $data['left'];
        $this->right = $data['right'];
    }

    public function left(): int
    {
        return $this->left;
    }

    public function right(): int
    {
        return $this->right;
    }
}
