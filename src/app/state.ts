import { Reducer, combineReducers } from 'redux'
import { SearchState, SearchAction, reducer as search } from 'search/state'

export type AppState = {
    readonly search: SearchState
}

export type AppAction = SearchAction

export const reducer: Reducer<AppState, AppAction> = combineReducers({ search })
