import { Reducer, combineReducers } from 'redux'
import { IdentifierList, reducer as identifiers } from './identifier'
import { TaxonSelection, reducer as taxon } from './taxon'
import { Name, reducer as names } from './name'
import { Options, reducer as options } from './options'

export type SearchState = {
    identifiers: IdentifierList[]
    taxon: TaxonSelection
    names: Name[]
    options: Options
}

export const reducer: Reducer<SearchState> = combineReducers({
    identifiers,
    taxon,
    names,
    options,
})
