import React from 'react'
import { useParams } from 'react-router-dom'

type Props = {}

export const ProteinPage: React.FC<Props> = () => {
    const { id } = useParams()

    return (
        <div className="container">
            <h1>Protein: {id}</h1>
        </div>
    )
}
