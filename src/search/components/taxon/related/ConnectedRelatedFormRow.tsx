import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from 'app/state'
import { Taxon, creators } from 'search/state/taxon'

import { RelatedFormRowFetcher } from './RelatedFormRowFetcher'

type OwnProps = {
    ncbi_taxon_id: number
}

const s2p = (state: AppState, props: OwnProps) => ({
    ncbi_taxon_id: props.ncbi_taxon_id,
})

const d2p = (dispatch: Dispatch) => ({
    select: (taxon: Taxon) => dispatch(creators.select(taxon)),
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = (props) => <RelatedFormRowFetcher {...props} />

export const ConnectedRelatedFormRow = connect(s2p, d2p)(Stateless)
