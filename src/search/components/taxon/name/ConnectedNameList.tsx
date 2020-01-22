import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from 'app/state'
import { Name, creators } from 'search/state/name'

import { NameListFetcher } from './NameListFetcher'

type OwnProps = {
    ncbi_taxon_id: number
}

const s2p = (state: AppState, props: OwnProps) => ({
    ncbi_taxon_id: props.ncbi_taxon_id,
    selected: state.search.names,
})

const d2p = (dispatch: Dispatch) => ({
    update: (names: Name[]) => dispatch(creators.update(names)),
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = (props) => <NameListFetcher {...props} />

export const ConnectedNameList = connect(s2p, d2p)(Stateless)
