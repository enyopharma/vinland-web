import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from 'app/state'
import { creators } from 'search/state/options'

import { OptionsCard } from './OptionsCard'


const s2p = ({ search }: AppState) => ({
    hh: search.options.hh.show,
    vh: search.options.vh.show,
    network: search.options.hh.network,
    publications: search.options.publications,
    methods: search.options.methods,
})

const d2p = (dispatch: Dispatch) => ({
    setShowHH: (show: boolean) => dispatch(creators.setShowHH(show)),
    setShowVH: (show: boolean) => dispatch(creators.setShowVH(show)),
    setNetwork: (network: boolean) => dispatch(creators.setNetwork(network)),
    setPublicationsThreshold: (threshold: number) => dispatch(creators.setPublicationsThreshold(threshold)),
    setMethodsThreshold: (threshold: number) => dispatch(creators.setMethodsThreshold(threshold)),
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = (props) => <OptionsCard {...props} />

export const ConnectedOptionsCard = connect(s2p, d2p)(Stateless)
