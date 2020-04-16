import React from 'react'

import { Protein } from 'features/proteins'
import { resources } from 'features/proteins'
import { ProgressBar } from 'pages/partials'
import { IsoformIdCard } from './IsoformIdCard'

type Props = {
    protein: Protein
    id: number
}

export const IsoformIdCardSuspense: React.FC<Props> = (props) => {
    return (
        <React.Suspense fallback={<ProgressBar />}>
            <IdCard {...props} />
        </React.Suspense>
    )
}

const IdCard: React.FC<Props> = ({ protein, id }) => {
    const isoform = resources.isoform(protein.id, id).read()

    return <IsoformIdCard protein={protein} isoform={isoform} />
}
