<?php

declare(strict_types=1);

namespace App\ReadModel;

class StatViewCache implements StatViewInterface
{
    const CACHE_KEY = 'stats';

    const CACHE_TTL = 3600;

    public function __construct(
        private StatViewInterface $stats,
        private \Predis\Client $client,
    ) {
    }

    public function all(): Statement
    {
        if (!$this->client->exists(self::CACHE_KEY)) {
            $stats = $this->stats->all()->fetch();

            $this->client->setex(self::CACHE_KEY, self::CACHE_TTL, json_encode($stats));
        }

        $stats = $this->client->get(self::CACHE_KEY);

        $iterable = fn () => yield json_decode($stats, true);

        return Statement::from($iterable());
    }
}
