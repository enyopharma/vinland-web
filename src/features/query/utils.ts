import { QueryResult, QueryResultStatuses, SuccessfulQueryResult } from './types'

export function isSuccessfulQueryResult(result: QueryResult): result is SuccessfulQueryResult {
    return result.status === QueryResultStatuses.SUCCESS
}
