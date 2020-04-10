import React from 'react'
import { useParams } from 'react-router-dom'

import { ProteinIdCardSuspense } from 'features/proteins'

export const ProteinPage: React.FC = () => {
    const { id } = useParams()

    if (!id) return null;

    return (
        <div className="container">
            <ProteinIdCardSuspense id={parseInt(id)} />
        </div>
    )
}
