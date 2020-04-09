import React, { useRef, useState, useEffect } from 'react'

import { ProteinCardTableSuspense } from './ProteinCardTableSuspense'

const isTypeSelected = (type: string) => type.trim().length > 0

export const ProteinCard: React.FC = () => {
    const ref = useRef<HTMLInputElement>(null)
    const [type, setType] = useState<string>('')
    const [query, setQuery] = useState<string>('')

    useEffect(() => {
        if (isTypeSelected(type)) {
            ref.current?.focus()
        }
    }, [type])

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
                {query.trim().length === 0 && (
                    <p>
                        Please enter a search term.
                    </p>
                )}
            </div>
            {query.trim().length > 0 && (
                <ProteinCardTableSuspense type={type} query={query} />
            )}
        </div>
    )
}
