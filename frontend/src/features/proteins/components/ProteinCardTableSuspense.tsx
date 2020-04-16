import React, { RefObject, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { resources } from 'features/proteins'
import { ProgressBar } from 'pages/partials'

const ProteinCardTable = React.lazy(() => import('./ProteinCardTable').then(module => ({ default: module.ProteinCardTable })))

type Props = {
    input: RefObject<HTMLInputElement>
    type: string
    query: string
}

export const ProteinCardTableSuspense: React.FC<Props> = (props) => (
    <React.Suspense fallback={<Fallback />}>
        <Fetcher {...props} />
    </React.Suspense>
)

const Fetcher: React.FC<Props> = ({ input, type, query }) => {
    const history = useHistory()
    const proteins = resources.proteins(type, query).read()

    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (e.keyCode === 13 && proteins.length === 1) {
                history.push(`/proteins/${proteins[0].id}`)
            }
        }

        input.current?.addEventListener('keydown', keydown)

        return () => {
            input.current?.removeEventListener('keydown', keydown)
        }
    })

    return proteins.length > 0
        ? <ProteinCardTable proteins={proteins} />
        : <Empty />
}

const Empty: React.FC = () => (
    <div className="card-body">
        No protein found.
    </div>
)

const Fallback: React.FC = () => (
    <div className="card-body">
        <ProgressBar />
    </div>
)
