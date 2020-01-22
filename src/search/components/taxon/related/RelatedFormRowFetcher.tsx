import React from 'react'

import { Taxon } from 'search/state/taxon'

import { api } from './api'
import { RelatedFormRow } from './RelatedFormRow'

type Props = {
    ncbi_taxon_id: number
    select: (names: Taxon) => void
}

export const RelatedFormRowFetcher: React.FC<Props> = ({ ncbi_taxon_id, select }) => {
    const related = api.read(ncbi_taxon_id)

    return <RelatedFormRow parent={related.parent} children={related.children} select={select} />
}
