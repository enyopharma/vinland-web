import React, { useRef, useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'

import { ProgressBar } from 'partials'

import { resources } from '../api'
import { actions } from '../reducers/proteins'
import { Resource, Protein } from '../types'
import { useSelector, useActionCreator } from '../hooks'

const ProteinTable = React.lazy(() => import('./ProteinTable').then(module => ({ default: module.ProteinTable })))

const example = { type: 'h' as 'h', accession: 'P27986', name: 'pik3r1' }

type UseSearchState = [
    string,
    string,
    Resource<Protein[]>,
    (t: string) => void,
    (q: string) => void,
    () => void,
    () => void,
]

const useSearch = (): UseSearchState => {
    const type = useSelector(state => state.proteins.type)
    const query = useSelector(state => state.proteins.query)
    const setType = useActionCreator(actions.setType)
    const setQuery = useActionCreator(actions.setQuery)
    const [resource, setResource] = useState<Resource<Protein[]>>(resources.proteins(type, query))

    return [
        type,
        query,
        resource,
        (typestr: string) => {
            const type = typestr as '' | 'h' | 'v'
            setType(type)
            setResource(resources.proteins(type, query))
        },
        (query: string) => {
            setQuery(query)
            setResource(resources.proteins(type, query))
        },
        () => {
            setType(example.type)
            setQuery(example.accession)
            setResource(resources.proteins(example.type, example.accession))
        },
        () => {
            setType(example.type)
            setQuery(example.name)
            setResource(resources.proteins(example.type, example.name))
        },
    ]
}

export const ProteinSearchPage: React.FC = () => {
    const input = useRef<HTMLInputElement>(null)
    const [type, query, resource, setType, setQuery, setAccessionExample, setNameExample] = useSearch()

    const isTypeEmpty = type.length === 0
    const isQueryEmpty = query.trim().length === 0

    useEffect(() => { if (!isTypeEmpty) input.current?.focus() }, [isTypeEmpty])

    return (
        <div className="container">
            <h1>Search for proteins</h1>
            <form action="#" className="form-horizontal" onSubmit={e => e.preventDefault()}>
                <div className="card">
                    <div className="card-body">
                        <div className="alert alert-primary">
                            A protein can be found using its
                            {' '}<Link to="#" onClick={setAccessionExample}>uniprot accession number</Link>
                            {' '}or
                            {' '}<Link to="#" onClick={setNameExample}>uniprot name</Link>.
                        </div>
                        <div className="form-group mb-0">
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
                                <input
                                    ref={input}
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Search for a protein accession number, name or description"
                                    value={query}
                                    disabled={isTypeEmpty}
                                    onChange={e => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {!isQueryEmpty && (
                        <React.Suspense fallback={<div className="card-body pt-0"><ProgressBar /></div>}>
                            <ProteinTableFetcher input={input} resource={resource} />
                        </React.Suspense>
                    )}
                </div>
            </form>
        </div>
    )
}

type ProteinTableFetcherProps = {
    input: React.RefObject<HTMLInputElement>
    resource: Resource<Protein[]>
}

const ProteinTableFetcher: React.FC<ProteinTableFetcherProps> = ({ input, resource }) => {
    const proteins = resource.read()

    return proteins.length > 0
        ? <SmartProteinTable input={input} proteins={proteins} />
        : <div className="card-body pt-0">No protein found.</div>
}

type SmartProteinTableProps = {
    input: React.RefObject<HTMLInputElement>
    proteins: Protein[]
}

const SmartProteinTable: React.FC<SmartProteinTableProps> = ({ input, proteins }) => {
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
