import React from 'react'

import { resources } from 'features/proteins'
import { ProgressBar } from 'pages/partials'
import { ProteinIdCard } from './ProteinIdCard'

type Props = {
    id: number
}

export const ProteinIdCardSuspense: React.FC<Props> = (props) => {
    return (
        <React.Suspense fallback={<ProgressBar />}>
            <IdCard {...props} />
        </React.Suspense>
    )
}

const IdCard: React.FC<Props> = ({ id }) => {
    const protein = resources.protein(id).read()

    return <ProteinIdCard protein={protein} />
}
