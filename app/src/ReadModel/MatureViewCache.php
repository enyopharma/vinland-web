<?php

declare(strict_types=1);

namespace App\ReadModel;

class MatureViewCache implements MatureViewInterface
{
    const CACHE_KEY = 'matures:%s:%s';

    const CACHE_TTL = 3600;

    public function __construct(
        private MatureViewInterface $matures,
        private \Predis\Client $client,
    ) {
    }

    public function taxon(int $left_value, int $right_value): Statement
    {
        $key = sprintf(self::CACHE_KEY, $left_value, $right_value);

        if (!$this->client->exists($key)) {
            $matures = $this->matures->taxon($left_value, $right_value)->fetchAll();

            $this->client->setex($key, self::CACHE_TTL, json_encode($matures));
        }

        $matures = (string) $this->client->get($key);

        return Statement::from(json_decode($matures, true));
    }
}
