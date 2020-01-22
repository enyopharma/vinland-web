import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from 'app/state'
import { creators } from 'search/state/options'

import { OptionsCard } from './OptionsCard'


const s2p = ({ search }: AppState) => ({
    hh: search.options.hh,
    vh: search.options.vh,
    neighbors: search.options.neighbors,
    publications: search.options.publications,
    methods: search.options.methods,
})

const d2p = (dispatch: Dispatch) => ({
    setHH: (hh: boolean) => dispatch(creators.setHH(hh)),
    setVH: (vh: boolean) => dispatch(creators.setVH(vh)),
    setNeighbors: (neighbors: boolean) => dispatch(creators.setNeighbors(neighbors)),
    setPublications: (threshold: number) => dispatch(creators.setPublications(threshold)),
    setMethods: (threshold: number) => dispatch(creators.setMethods(threshold)),
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = (props) => <OptionsCard {...props} />

export const ConnectedOptionsCard = connect(s2p, d2p)(Stateless)
