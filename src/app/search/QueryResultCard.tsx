import React from 'react'
import { connect } from 'react-redux'

import { SearchState, state2Query } from './src/search'

import { QueryResultPanel } from './QueryResultPanel'

const s2p = ({ search }: { search: SearchState }) => ({
    query: state2Query(search)
})

type Props = ReturnType<typeof s2p>

const Stateless: React.FC<Props> = ({ query }) => (
    <div className="card">
        <div className="card-body">
            <QueryResultPanel query={query} />
        </div>
    </div>
)

export const QueryResultCard = connect(s2p)(Stateless)
