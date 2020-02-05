import md5 from 'md5'
import { AppSelector } from 'app'
import { Query } from 'features/query'
import { parse as parseIdentifiers } from 'features/identifiers'

export const state2query: AppSelector<Query> = state => {
    const identifiers = parseIdentifiers(state.search.identifiers)
    const ncbi_taxon_id = state.search.taxonomy.taxon === null ? 0 : state.search.taxonomy.taxon.ncbi_taxon_id

    const parts: string[] = []
    if (state.search.options.hh) parts.push('HH')
    if (state.search.options.vh) parts.push('VH')
    if (state.search.options.neighbors) parts.push('NEIGHBORS')
    parts.push(state.search.options.publications.toString())
    parts.push(state.search.options.methods.toString())
    parts.push(ncbi_taxon_id.toString())
    parts.push(...state.search.taxonomy.names.sort((a, b) => a.localeCompare(b)))
    parts.push(...identifiers.sort((a: string, b: string) => a.localeCompare(b)))

    return {
        key: md5(parts.join(':')),
        identifiers: identifiers,
        ncbi_taxon_id: ncbi_taxon_id,
        names: state.search.taxonomy.names,
        hh: state.search.options.hh,
        vh: state.search.options.vh,
        neighbors: state.search.options.neighbors,
        publications: state.search.options.publications,
        methods: state.search.options.methods,
    }
}
