import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";

import { Protein } from 'features/proteins'
import { resources } from 'features/proteins'

import { SearchResultList } from 'features/autocomplete'

const isTypeSelected = (type: string) => type.trim().length > 0

export const ProteinCard: React.FC = () => {
    const ref = useRef<HTMLInputElement>(null)
    const [type, setType] = useState<string>('')
    const [query, setQuery] = useState<string>('')
    const history = useHistory()

    useEffect(() => {
        if (isTypeSelected(type)) {
            ref.current?.focus()
        }
    }, [type])

    const search = (query: string) => resources.proteins(type, query).read()

    const select = (protein: Protein) => history.push(`/proteins/${protein.id}`)

    return (
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
                        <input
                            ref={ref}
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Search for a protein accession number, name or description"
                            value={query}
                            disabled={type === ''}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <SearchResultList input={ref} query={query} search={search} select={select} flushed>
                Please enter a search term
            </SearchResultList>
        </div>
    )
}
