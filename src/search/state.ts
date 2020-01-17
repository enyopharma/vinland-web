import { Reducer, combineReducers } from 'redux'
import { Virus, VirusAction, reducer as virus } from './state/virus'
import { Options, OptionsAction, reducer as options } from './state/options'
import { IdentifierList, IdentifierAction, reducer as identifiers } from './state/identifier'

export type SearchState = {
    readonly identifiers: IdentifierList[]
    readonly virus: Virus
    readonly options: Options
}

export type SearchAction =
    | IdentifierAction
    | VirusAction
    | OptionsAction

export const reducer: Reducer<SearchState, SearchAction> = combineReducers({
    identifiers,
    virus,
    options,
})
