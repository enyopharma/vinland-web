import md5 from 'md5'
import { Reducer, AnyAction } from '@reduxjs/toolkit'
import { reducer as navReducer } from './reducers/nav'
import { reducer as optionsReducer } from './reducers/options'
import { reducer as taxonomyReducer } from './reducers/taxonomy'
import { reducer as identifiersReducer } from './reducers/identifiers'
import { PageState, IdentifierList, Taxonomy, DisplayOptions } from './types'

export const reducer: Reducer<PageState> = (state: PageState | undefined, action: AnyAction) => {
    const lists = identifiersReducer(state?.identifiers.lists, action)
    const taxonomy = taxonomyReducer(state?.taxonomy, action)
    const options = optionsReducer(state?.options, action)
    const rawNav = navReducer(state?.nav, action)

    const parsed = parse(lists)

    const key = makeKey(parsed, taxonomy, options)

    const nav = key === state?.key ? rawNav : {
        tab: rawNav.tab,
        interactions: { offset: 0 },
        proteins: {
            tab: rawNav.proteins.tab,
            current: 0,
            offsets: { a: 0, h: 0, v: 0 },
        },
        network: {
            warning: true,
            ratio: rawNav.network.ratio,
            labels: rawNav.network.labels,
        },
    }

    return { key, identifiers: { lists, parsed }, taxonomy, options, nav }
}

const parse = (lists: IdentifierList[]) => lists.reduce((merged: string[], list: IdentifierList) => {
    return list.identifiers.split(/(,|\s|\|)+/)
        .map(i => i.trim().toUpperCase())
        .filter(i => i.length >= 2 && i.length <= 12)
        .reduce((merged, identifier) => {
            return merged.includes(identifier) ? merged : [...merged, identifier]
        }, merged)
}, [])

const makeKey = (parsed: string[], taxonomy: Taxonomy, options: DisplayOptions) => {
    const ncbi_taxon_id = taxonomy.taxon !== null
        ? taxonomy.taxon.ncbi_taxon_id
        : 0

    const parts: string[] = []
    if (options.hh) parts.push('HH')
    if (options.vh) parts.push('VH')
    if (options.hh && options.neighbors) parts.push('NEIGHBORS')
    parts.push(options.publications.toString())
    parts.push(options.methods.toString())
    if (options.is_gold) parts.push('GOLD')
    if (options.is_binary) parts.push('BINARY')
    parts.push(ncbi_taxon_id.toString())
    parts.push(...[...taxonomy.names].sort((a: string, b: string) => a.localeCompare(b))) // sort is mutating the readonly array
    parts.push(...parsed.sort((a: string, b: string) => a.localeCompare(b)))

    return md5(parts.join(':'))
}
