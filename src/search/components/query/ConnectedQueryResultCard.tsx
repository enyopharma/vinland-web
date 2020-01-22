import md5 from 'md5'
import React from 'react'
import { connect } from 'react-redux'

import { AppState } from 'app/state'
import { parse as parseIdentifiers } from 'search/state/identifier'

import { QueryResultCardPanel } from './QueryResultCardPanel'

const state2Query = ({ search }: AppState) => {
    const identifiers = parseIdentifiers(search.identifiers)
    const ncbi_taxon_id = search.taxon === null ? 0 : search.taxon.ncbi_taxon_id

    const parts: string[] = []
    if (search.options.hh) parts.push('HH')
    if (search.options.vh) parts.push('VH')
    if (search.options.neighbors) parts.push('NEIGHBORS')
    parts.push(search.options.publications.toString())
    parts.push(search.options.methods.toString())
    parts.push(ncbi_taxon_id.toString())
    parts.push(...search.names.sort((a, b) => a.localeCompare(b)))
    parts.push(...identifiers.sort((a, b) => a.localeCompare(b)))

    return {
        key: md5(parts.join(':')),
        identifiers: identifiers,
        ncbi_taxon_id: ncbi_taxon_id,
        names: search.names,
        hh: search.options.hh,
        vh: search.options.vh,
        neighbors: search.options.neighbors,
        publications: search.options.publications,
        methods: search.options.methods,
    }
}


const s2p = (state: AppState) => ({
    query: state2Query(state)
})

type Props = ReturnType<typeof s2p>

const Stateless: React.FC<Props> = (props) => <QueryResultCardPanel {...props} />

export const ConnectedQueryResultCard = connect(s2p)(Stateless)
