<?php declare(strict_types=1);

namespace Domain\Input;

use Quanta\Validation\Input;
use Quanta\Validation\InputInterface;

use Domain\Validations\Slice;
use Domain\Validations\IsTypedAs;
use Domain\Validations\IsHHOptions;
use Domain\Validations\IsVHOptions;
use Domain\Validations\IsHumanOptions;
use Domain\Validations\IsVirusOptions;
use Domain\Validations\IsFilterOptions;

final class QueryInput
{
    const MAX_IDENTIFIERS = 500;

    private $hh;
    private $vh;
    private $human;
    private $virus;
    private $methods;
    private $publications;

    public static function from(\PDO $pdo, array $data): InputInterface
    {
        $slice = new Slice;
        $isarr = new IsTypedAs('array');

        return Input::pure(fn (...$xs) => new self(...$xs))(
            $slice($data, 'hh')->validate($isarr, new IsHHOptions),
            $slice($data, 'vh')->validate($isarr, new IsVHOptions),
            $slice($data, 'human')->validate($isarr, new IsHumanOptions(self::MAX_IDENTIFIERS)),
            $slice($data, 'virus')->validate($isarr, new IsVirusOptions($pdo)),
            $slice($data, 'methods')->validate($isarr, new IsFilterOptions),
            $slice($data, 'publications')->validate($isarr, new IsFilterOptions),
        );
    }

    private function __construct(array $hh, array $vh, array $human, array $virus, array $methods, array $publications)
    {
        $this->hh = $hh;
        $this->vh = $vh;
        $this->human = $human;
        $this->virus = $virus;
        $this->methods = $methods;
        $this->publications = $publications;
    }

    public function isComplete(): bool
    {
        return count($this->human['identifiers']) > 0 || $this->virus['left'] > 0;
    }

    public function wantsHHNetwork(): bool
    {
        return $this->hh['show']
            && $this->hh['network']
            && count($this->human['identifiers']) > 0;
    }

    public function wantsHHInteractions(): bool
    {
        return $this->hh['show']
            && (! $this->hh['network'])
            && count($this->human['identifiers']) > 0;
    }

    public function wantsVHInteractions(): bool
    {
        return $this->vh['show'];
    }

    public function human(): array
    {
        return [$this->human['identifiers']];
    }

    public function virus(): array
    {
        return [$this->virus['left'], $this->virus['right'], $this->virus['names']];
    }

    public function filters(): array
    {
        return [$this->methods['threshold'], $this->publications['threshold']];
    }
}
