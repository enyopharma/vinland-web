import md5 from 'md5'
import { AppState } from 'app'
import { parse as parseIdentifiers } from 'features/identifiers'

/**
 * Caution: Array.sort() mutates the array which is not allowed.
 * Need to clone identifiers and names (parseIdentifiers() or Array.slice()) before sorting.
 */
export const state2query = (state: AppState) => {
    const identifiers = parseIdentifiers(state.interactions.search.identifiers)
    const names = state.interactions.search.taxonomy.names.slice()
    const ncbi_taxon_id = state.interactions.search.taxonomy.taxon === null ? 0 : state.interactions.search.taxonomy.taxon.ncbi_taxon_id

    const parts: string[] = []
    if (state.interactions.search.options.hh) parts.push('HH')
    if (state.interactions.search.options.vh) parts.push('VH')
    if (state.interactions.search.options.hh && state.interactions.search.options.neighbors) parts.push('NEIGHBORS')
    parts.push(state.interactions.search.options.publications.toString())
    parts.push(state.interactions.search.options.methods.toString())
    parts.push(ncbi_taxon_id.toString())
    parts.push(...names.sort((a: string, b: string) => a.localeCompare(b)))
    parts.push(...identifiers.sort((a: string, b: string) => a.localeCompare(b)))

    return {
        key: md5(parts.join(':')),
        identifiers: identifiers,
        ncbi_taxon_id: ncbi_taxon_id,
        names: names,
        hh: state.interactions.search.options.hh,
        vh: state.interactions.search.options.vh,
        neighbors: state.interactions.search.options.neighbors,
        publications: state.interactions.search.options.publications,
        methods: state.interactions.search.options.methods,
    }
}
