import React from 'react'

import { resources } from 'features/proteins'
import { ProteinIdCard } from './ProteinIdCard'

type Props = {
    id: number
}

export const ProteinIdCardSuspense: React.FC<Props> = (props) => {
    return (
        <React.Suspense fallback={<Fallback />}>
            <IdCard {...props} />
        </React.Suspense>
    )
}

const IdCard: React.FC<Props> = ({ id }) => {
    const protein = resources.protein(id).read()

    return <ProteinIdCard protein={protein} />
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
