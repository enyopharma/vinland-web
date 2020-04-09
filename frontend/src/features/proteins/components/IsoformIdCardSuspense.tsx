import React from 'react'

import { Protein } from 'features/proteins'
import { resources } from 'features/proteins'
import { IsoformIdCard } from './IsoformIdCard'

type Props = {
    protein: Protein
    id: number
}

export const IsoformIdCardSuspense: React.FC<Props> = (props) => {
    return (
        <React.Suspense fallback={<Fallback />}>
            <IdCard {...props} />
        </React.Suspense>
    )
}

const IdCard: React.FC<Props> = ({ protein, id }) => {
    const isoform = resources.isoform(protein.id, id).read()

    return <IsoformIdCard protein={protein} isoform={isoform} />
}

const Fallback: React.FC = () => {
    return (
        <div className="container">
            <div className="progress">
                <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                    style={{ width: '100%' }}
                ></div>
            </div>
        </div>
    )
}
