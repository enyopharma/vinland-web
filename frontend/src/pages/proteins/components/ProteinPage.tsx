import React from 'react'
import { useParams } from 'react-router-dom'

import { resources } from 'pages/proteins/api'
import { ProteinIdCard } from './ProteinIdCard'
import { ProgressBar } from 'partials'

export const ProteinPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    return (
        <div className="container">
            <React.Suspense fallback={<ProgressBar />}>
                <Fetcher id={parseInt(id)} />
            </React.Suspense>
        </div>
    )
}

type FetcherProps = {
    id: number
}

const Fetcher: React.FC<FetcherProps> = ({ id }) => {
    const protein = resources.protein(id).read()

    return <ProteinIdCard protein={protein} />
}
