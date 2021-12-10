<?php

declare(strict_types=1);

namespace App\ReadModel;

class StatViewSql implements StatViewInterface
{
    const COUNT_DESCRIPTIONS_SQL = <<<SQL
        SELECT COUNT(*)
        FROM interactions AS i, descriptions AS d
        WHERE i.id = d.interaction_id
        AND i.type = ?
    SQL;

    const COUNT_INTERACTIONS_SQL = <<<SQL
        SELECT COUNT(*) FROM interactions WHERE type = ?
    SQL;

    const COUNT_PUBLICATIONS_SQL = <<<SQL
        SELECT COUNT(DISTINCT d.pmid)
        FROM interactions AS i, descriptions AS d
        WHERE i.id = d.interaction_id
        AND i.type = ?
    SQL;

    public function __construct(
        private \PDO $pdo
    ) {
    }

    public function all(): Statement
    {
        $count_descriptions_sth = $this->pdo->prepare(self::COUNT_DESCRIPTIONS_SQL);
        $count_interactions_sth = $this->pdo->prepare(self::COUNT_INTERACTIONS_SQL);
        $count_publications_sth = $this->pdo->prepare(self::COUNT_PUBLICATIONS_SQL);

        $count_descriptions_sth->execute(['hh']);
        $count_interactions_sth->execute(['hh']);
        $count_publications_sth->execute(['hh']);

        $stats['hh']['descriptions'] = $count_descriptions_sth->fetchColumn();
        $stats['hh']['interactions'] = $count_interactions_sth->fetchColumn();
        $stats['hh']['publications'] = $count_publications_sth->fetchColumn();

        $count_descriptions_sth->execute(['vh']);
        $count_interactions_sth->execute(['vh']);
        $count_publications_sth->execute(['vh']);

        $stats['vh']['descriptions'] = $count_descriptions_sth->fetchColumn();
        $stats['vh']['interactions'] = $count_interactions_sth->fetchColumn();
        $stats['vh']['publications'] = $count_publications_sth->fetchColumn();

        $iterable = fn () => yield $stats;

        return Statement::from($iterable());
    }
}
