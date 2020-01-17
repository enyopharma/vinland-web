import md5 from 'md5'
import React from 'react'
import { connect } from 'react-redux'

import { AppState } from 'app/state'
import { parse as parseIdentifiers } from 'search/state/identifier'

import { QueryResultCardPanel } from './QueryResultCardPanel'

export const state2Query = ({ search }: AppState) => {
    const identifiers = parseIdentifiers(search.identifiers)

    const parts: string[] = []
    if (search.options.hh.show) parts.push('HH')
    if (search.options.vh.show) parts.push('VH')
    if (search.options.hh.network) parts.push('NETWORK')
    parts.push(search.options.publications.toString())
    parts.push(search.options.methods.toString())
    parts.push(search.virus.taxon.left.toString())
    parts.push(search.virus.taxon.right.toString())
    parts.push(...search.virus.names.sort((a, b) => a.localeCompare(b)))
    parts.push(...identifiers.sort((a, b) => a.localeCompare(b)))

    return {
        key: md5(parts.join(':')),
        identifiers: identifiers,
        taxon: {
            left: search.virus.taxon.left,
            right: search.virus.taxon.right,
        },
        names: search.virus.names,
        hh: search.options.hh.show,
        vh: search.options.vh.show,
        network: search.options.hh.network,
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
