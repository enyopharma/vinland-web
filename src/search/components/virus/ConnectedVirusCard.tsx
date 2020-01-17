import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from 'app/state'
import { Taxon, Name, creators } from 'search/state/virus'

import { VirusCard } from './VirusCard'

const s2p = ({ search }: AppState) => ({
    taxon: search.virus.taxon,
    names: search.virus.names,
})

const d2p = (dispatch: Dispatch) => ({
    selectTaxon: (taxon: Taxon) => dispatch(creators.selectTaxon(taxon)),
    unselectTaxon: () => dispatch(creators.unselectTaxon()),
    updateNames: (names: Name[]) => dispatch(creators.updateNames(names)),
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = (props) => <VirusCard {...props} />

export const ConnectedVirusCard = connect(s2p, d2p)(Stateless)
