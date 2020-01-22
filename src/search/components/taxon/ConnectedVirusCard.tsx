import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from 'app/state'
import { Taxon, creators } from 'search/state/taxon'

import { VirusCard } from './VirusCard'

const s2p = ({ search }: AppState) => ({
    taxon: search.taxon,
})

const d2p = (dispatch: Dispatch) => ({
    select: (taxon: Taxon) => dispatch(creators.select(taxon)),
    unselect: () => dispatch(creators.unselect()),
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = (props) => <VirusCard {...props} />

export const ConnectedVirusCard = connect(s2p, d2p)(Stateless)
