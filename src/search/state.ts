import { Reducer, combineReducers } from 'redux'
import { Name, NameAction, reducer as names } from './state/name'
import { Taxon, TaxonAction, reducer as taxon } from './state/taxon'
import { Options, OptionsAction, reducer as options } from './state/options'
import { IdentifierList, IdentifierAction, reducer as identifiers } from './state/identifier'

export type SearchState = {
    readonly identifiers: IdentifierList[]
    readonly taxon: Taxon | null
    readonly names: Name[]
    readonly options: Options
}

export type SearchAction =
    | IdentifierAction
    | TaxonAction
    | NameAction
    | OptionsAction

export const reducer: Reducer<SearchState, SearchAction> = combineReducers({
    identifiers,
    taxon,
    names,
    options,
})
