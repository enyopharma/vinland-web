import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { ProgressBar } from 'partials'

import { resources } from '../api'
import { Protein } from '../types'

const ProteinTable = React.lazy(() => import('./ProteinTable').then(module => ({ default: module.ProteinTable })))

export const ProteinSearchPage: React.FC = () => {
    const ref = useRef<HTMLInputElement>(null)
    const [type, setType] = useState<string>('')
    const [query, setQuery] = useState<string>('')

    return (
        <div className="container">
            <h1>Search for proteins</h1>
            <form action="#" className="form-horizontal" onSubmit={e => e.preventDefault()}>
                <div className="card">
                    <div className="card-body">
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">@</span>
                                </div>
                                <select
                                    value={type}
                                    className="form-control form-control-lg col-2"
                                    onChange={e => { setType(e.target.value) }}
                                >
                                    <option value="">Type</option>
                                    <option value="h">Human</option>
                                    <option value="v">Virus</option>
                                </select>
                                <Input input={ref} type={type} value={query} update={setQuery} />
                            </div>
                        </div>
                        {query.trim().length === 0 && (
                            <p>
                                Please enter a search term.
                            </p>
                        )}
                    </div>
                    {query.trim().length > 0 && (
                        <div className="card-body">
                            <React.Suspense fallback={<ProgressBar />}>
                                <Fetcher input={ref} type={type} query={query} />
                            </React.Suspense>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}

type InputProps = {
    input: React.RefObject<HTMLInputElement>
    type: string
    value: string
    update: (value: string) => void
}

const Input: React.FC<InputProps> = ({ input, type, value, update }) => {
    useEffect(() => { if (type.trim().length > 0) input.current?.focus() }, [input, type])

    return (
        <input
            ref={input}
            type="text"
            className="form-control form-control-lg"
            placeholder="Search for a protein accession number, name or description"
            value={value}
            disabled={type === ''}
            onChange={e => update(e.target.value)}
        />
    )
}

type FetcherProps = {
    input: React.RefObject<HTMLInputElement>
    type: string
    query: string
}

const Fetcher: React.FC<FetcherProps> = ({ input, type, query }) => {
    const proteins = resources.proteins(type, query).read()

    return proteins.length > 0
        ? <Table input={input} proteins={proteins} />
        : <p>No protein found.</p>
}

type TableProps = {
    input: React.RefObject<HTMLInputElement>
    proteins: Protein[]
}

const Table: React.FC<TableProps> = ({ input, proteins }) => {
    const history = useHistory()

    const keydown = (e: KeyboardEvent) => {
        if (e.keyCode === 13 && proteins.length > 0) {
            history.push(`/proteins/${proteins[0].id}`)
        }
    }

    useEffect(() => {
        const elem = input.current

        elem?.addEventListener('keydown', keydown)

        return () => elem?.removeEventListener('keydown', keydown)
    })

    return <ProteinTable proteins={proteins} />
}
