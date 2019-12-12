import md5 from 'md5'
import { Reducer, combineReducers } from 'redux'
import { IdentifierList, reducer as identifiers, parse as parseIdentifiers } from './identifier'
import { TaxonSelection, reducer as taxon } from './taxon'
import { reducer as names } from './name'
import { Options, reducer as options } from './options'

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

export const state2Query = (state: SearchState) => {
    const identifiers = parseIdentifiers(state.identifiers)

    const parts: string[] = []
    if (state.options.hh.show) parts.push('HH')
    if (state.options.vh.show) parts.push('VH')
    if (state.options.hh.network) parts.push('NETWORK')
    parts.push(state.options.publications.toString())
    parts.push(state.options.methods.toString())
    parts.push(state.taxon.left.toString())
    parts.push(state.taxon.right.toString())
    parts.push(...identifiers.sort((a, b) => a.localeCompare(b)))

    return {
        key: md5(parts.join(':')),
        identifiers: identifiers,
        taxon: {
            left: state.taxon.left,
            right: state.taxon.right,
        },
        names: state.names,
        hh: state.options.hh.show,
        vh: state.options.vh.show,
        network: state.options.hh.network,
        publications: state.options.publications,
        methods: state.options.methods,
    }
}
