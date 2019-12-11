import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { SearchState } from './src/search'
import { setShowHH, setShowVH, setNetwork, setPublicationsThreshold, setMethodsThreshold } from './src/options'

import { FilterOptionsRow } from './FilterOptionsRow'
import { DisplayOptionsRow } from './DisplayOptionsRow'

const s2p = ({ search }: { search: SearchState }) => ({
    hh: search.options.hh.show,
    vh: search.options.vh.show,
    network: search.options.hh.network,
    publications: search.options.publications,
    methods: search.options.methods,
})

const d2p = (dispatch: Dispatch) => ({
    setShowHH: (show: boolean) => dispatch(setShowHH(show)),
    setShowVH: (show: boolean) => dispatch(setShowVH(show)),
    setNetwork: (network: boolean) => dispatch(setNetwork(network)),
    setPublicationsThreshold: (threshold: number) => dispatch(setPublicationsThreshold(threshold)),
    setMethodsThreshold: (threshold: number) => dispatch(setMethodsThreshold(threshold)),
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = (props) => (
    <div className="card">
        <div className="card-body">
            <DisplayOptionsRow {...props} />
            <FilterOptionsRow {...props} />
        </div>
    </div>
)

export const OptionsCard = connect(s2p, d2p)(Stateless)
