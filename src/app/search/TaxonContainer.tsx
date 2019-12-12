import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { SearchState } from './src/search'
import { Taxon, select, unselect } from './src/taxon'

import { TaxonCard } from './TaxonCard'

const s2p = ({ search }: { search: SearchState }) => ({
    taxon: search.taxon,
})

const d2p = (dispatch: Dispatch) => ({
    select: (taxon: Taxon) => dispatch(select(taxon)),
    unselect: () => dispatch(unselect()),
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = (props) => <TaxonCard {...props} />

export const TaxonContainer = connect(s2p, d2p)(Stateless)
