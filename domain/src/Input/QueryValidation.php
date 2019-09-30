<?php

declare(strict_types=1);

namespace Domain\Input;

final class QueryValidation
{
    const MAX_ACCESSIONS = 500;

    const SELECT_TAXON_SQL = <<<SQL
        SELECT COUNT(*)
        FROM taxon
        WHERE node_rank = ? AND left_value >= ? AND right_value <= ?
SQL;

    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function result(array $data): ValidationResult
    {
        // validate the data array.
        $errors = [
            ...$this->booleanErrors($data, 'hh', 'show'),
            ...$this->booleanErrors($data, 'hh', 'network'),
            ...$this->booleanErrors($data, 'vh', 'show'),
            ...$this->arrayErrors($data, 'human', 'accessions'),
            ...$this->positiveIntegerErrors($data, 'virus', 'left'),
            ...$this->positiveIntegerErrors($data, 'virus', 'right'),
            ...$this->arrayErrors($data, 'virus', 'names'),
            ...$this->integerGreaterThanZeroErrors($data, 'publications', 'threshold'),
            ...$this->integerGreaterThanZeroErrors($data, 'methods', 'threshold'),
        ];

        if (count($errors) > 0) {
            return ValidationResult::failure(...$errors);
        }

        // sanitize accessions and name.
        $accessions = $this->sanitizedStringArray($data['human']['accessions']);
        $names = $this->sanitizedStringArray($data['virus']['names']);

        // validate the accessions.
        $errors = $this->accessionArrayErrors($accessions);

        if (count($errors) > 0) {
            return ValidationResult::failure(...$errors);
        }

        // validate the taxon boundaries.
        $errors = $this->taxonBoundariesErrors($data['virus']['left'], $data['virus']['right']);

        if (count($errors) > 0) {
            return ValidationResult::failure(...$errors);
        }

        // return the results.
        return ValidationResult::success([
            'hh' => [
                'show' => filter_var($data['hh']['show'], FILTER_VALIDATE_BOOLEAN, ['flags' => FILTER_NULL_ON_FAILURE]),
                'network' => filter_var($data['hh']['network'], FILTER_VALIDATE_BOOLEAN, ['flags' => FILTER_NULL_ON_FAILURE]),
            ],
            'vh' => [
                'show' => filter_var($data['vh']['show'], FILTER_VALIDATE_BOOLEAN, ['flags' => FILTER_NULL_ON_FAILURE]),
            ],
            'human' => [
                'accessions' => $data['human']['accessions'],
            ],
            'virus' => [
                'left' => (int) $data['virus']['left'],
                'right' => (int) $data['virus']['right'],
                'names' => $names,
            ],
            'publications' => [
                'threshold' => (int) $data['publications']['threshold'],
            ],
            'methods' => [
                'threshold' => (int) $data['methods']['threshold'],
            ],
        ]);
    }

    private function value(array $data, string $key, string ...$keys)
    {
        if (is_array($data[$key]) && count($keys) > 0) {
            return $this->value($data[$key], ...$keys);
        }

        return $data[$key] ?? null;
    }

    public function message(string $msg, string ...$keys): string
    {
        return sprintf($msg, implode('', array_map(fn ($v) => '[' . $v . ']', $keys)));
    }

    private function arrayErrors(array $data, string ...$keys): array
    {
        $value = $this->value($data, ...$keys);

        return ! is_array($value)
            ? [$this->message('%s must be an array', ...$keys)]
            : [];
    }

    private function booleanErrors(array $data, string ...$keys): array
    {
        $value = $this->value($data, ...$keys);

        /** @var ?bool */
        $filtered = filter_var($value, FILTER_VALIDATE_BOOLEAN, ['flags' => FILTER_NULL_ON_FAILURE]);

        return $value === null || $filtered === null
            ? [$this->message('%s must be a boolean', ...$keys)]
            : [];
    }

    private function positiveIntegerErrors(array $data, string ...$keys): array
    {
        $value = $this->value($data, ...$keys);

        $filtered = filter_var($value, FILTER_VALIDATE_INT, ['options' => [
            'min_range' => 0,
        ]]);

        return $filtered === false
            ? [$this->message('%s must be a positive integer', ...$keys)]
            : [];
    }

    private function integerGreaterThanZeroErrors(array $data, string ...$keys): array
    {
        $value = $this->value($data, ...$keys);

        $filtered = filter_var($value, FILTER_VALIDATE_INT, ['options' => [
            'min_range' => 1,
        ]]);

        return $filtered === false
            ? [$this->message('%s must be greater than zero', ...$keys)]
            : [];
    }

    private function accessionArrayErrors(array $accessions): array
    {
        return count($accessions) > self::MAX_ACCESSIONS
            ? ['Too many accessions given']
            : [];
    }

    private function taxonBoundariesErrors(int $left, int $right): array
    {
        if ($left == 0 && $right == 0) {
            return [];
        }

        // $left > $right clause is including $left > 0 && $right == 0
        if ($left == 0 && $right > 0 || $left > $right) {
            return ['Invalid taxon boundaries'];
        }

        // invalid when more than one species between boundaries.
        $select_taxon_sth = $this->pdo->prepare(self::SELECT_TAXON_SQL);

        $select_taxon_sth->execute([\Domain\Taxon::ROOT_NODE_RANK, $left, $right]);

        $species = ($nb = $select_taxon_sth->fetchColumn()) ? $nb : 0;

        return $species > 1 ? ['Invalid taxon boundaries'] : [];
    }

    private function sanitizedStringArray(array $values): array
    {
        $values = array_filter($values, 'is_string');
        $values = array_map('trim', $values);
        $values = array_unique($values);
        $values = array_filter($values, fn ($v) => ! empty($v));

        return $values;
    }
}
