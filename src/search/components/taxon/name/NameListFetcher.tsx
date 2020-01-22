import React from 'react'

import { Name } from 'search/state/name'

import { api } from './api'
import { NameList } from './NameList'

type Props = {
    ncbi_taxon_id: number
    selected: Name[]
    update: (names: Name[]) => void
}

export const NameListFetcher: React.FC<Props> = ({ ncbi_taxon_id, selected, update }) => {
    const names = api.read(ncbi_taxon_id)

    return <NameList names={names} selected={selected} update={update} />
}
