import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { SearchState } from './src/search'
import { Annotation } from './src/annotation'
import { add, update, remove, select, parse } from './src/identifier'

import { IdentifiersCard } from './IdentifiersCard'

const s2p = ({ search }: { search: SearchState }) => ({
    lists: search.identifiers,
    parsed: parse(search.identifiers).length,
})

const d2p = (dispatch: Dispatch) => ({
    add: () => dispatch(add()),
    update: (i: number) => (identifiers: string) => dispatch(update(i, identifiers)),
    remove: (i: number) => () => dispatch(remove(i)),
    select: (annotation: Annotation) => dispatch(select(annotation))
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = (props) => <IdentifiersCard {...props} />

export const IdentifiersContainer = connect(s2p, d2p)(Stateless)
