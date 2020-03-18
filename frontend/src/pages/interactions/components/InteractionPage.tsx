import React from 'react'
import { useParams } from 'react-router-dom'

export const InteractionPage: React.FC = () => {
    const { id } = useParams()

    return (
        <div className="container">
            <h1>Interaction: {id}</h1>
        </div>
    )
}
