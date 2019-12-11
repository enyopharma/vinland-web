import { Reducer, combineReducers } from 'redux'
import { IdentifierList, reducer as identifiers, parse as parseIdentifiers } from './identifier'
import { TaxonSelection, reducer as taxon } from './taxon'
import { reducer as names } from './name'
import { Options, reducer as options } from './options'
import { Query } from './interaction'

export type SearchState = {
    identifiers: IdentifierList[]
    taxon: TaxonSelection
    names: string[]
    options: Options
}

export const reducer: Reducer<SearchState> = combineReducers({
    identifiers,
    taxon,
    names,
    options,
})

export const state2Query = (state: SearchState): Query => {
    return {
        human: {
            identifiers: parseIdentifiers(state.identifiers)
        },
        virus: {
            left: state.taxon.left,
            right: state.taxon.right,
            names: state.names,
        },
        hh: state.options.hh,
        vh: state.options.vh,
        publications: {
            threshold: state.options.publications,
        },
        methods: {
            threshold: state.options.methods,
        },
    }
}
