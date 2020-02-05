import { QueryResult, QueryResultStatuses, SuccessfulQueryResult } from '.'

export function isSuccessfulQueryResult(result: QueryResult): result is SuccessfulQueryResult {
    return result.status === QueryResultStatuses.SUCCESS
}
