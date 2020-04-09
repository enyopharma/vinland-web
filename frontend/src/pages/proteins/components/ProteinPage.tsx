import React from 'react'
import { useParams } from 'react-router-dom'

import { ProteinIdCardSuspense } from 'features/proteins'

export const ProteinPage: React.FC = () => {
    const { id } = useParams()

    if (!id) return null;

    return <ProteinIdCardSuspense id={parseInt(id)} />
}
