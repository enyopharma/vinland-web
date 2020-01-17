import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from 'app/state'
import { Annotation, creators, parse } from 'search/state/identifier'

import { IdentifierCard } from './IdentifierCard'

const s2p = ({ search }: AppState) => ({
    lists: search.identifiers,
    parsed: parse(search.identifiers).length,
})

const d2p = (dispatch: Dispatch) => ({
    add: () => dispatch(creators.add()),
    update: (i: number) => (identifiers: string) => dispatch(creators.update(i, identifiers)),
    remove: (i: number) => () => dispatch(creators.remove(i)),
    select: (annotation: Annotation) => dispatch(creators.select(annotation))
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = (props) => <IdentifierCard {...props} />

export const ConnectedIdentifierCard = connect(s2p, d2p)(Stateless)
