import React from 'react'
import { connect } from 'react-redux'

import { SearchState } from './src/search'
import { state2Query } from './src/query'

import { QueryResultPanel } from './QueryResultPanel'

const s2p = ({ search }: { search: SearchState }) => ({
    query: state2Query(search)
})

type Props = ReturnType<typeof s2p>

const Stateless: React.FC<Props> = (props) => <QueryResultPanel {...props} />

export const QueryResultContainer = connect(s2p)(Stateless)
