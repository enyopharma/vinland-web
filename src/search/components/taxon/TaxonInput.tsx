import React, { useRef, useState } from 'react'

import { Taxon } from 'search/state/taxon'
import { SearchResultListPanel } from 'search/components/shared/SearchResultListPanel'

import { api } from './api'

type Props = {
    select: (taxon: Taxon) => void
}

export const TaxonInput: React.FC<Props> = ({ select }) => {
    const input = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState<string>('')
    const [enabled, setEnabled] = useState<boolean>(false)

    const search = (query: string) => api.search(query)

    const selectAndClose = (taxon: Taxon) => {
        setEnabled(false)
        select(taxon)
    }

    const handleKeyDown = (code: number) => {
        if (!input.current) return
        if (code === 27) {
            input.current.blur()
        }
    }

    return (
        <div className="form-group">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">@</span>
                </div>
                <input
                    ref={input}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search for a viral species"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={e => setEnabled(true)}
                    onBlur={e => setEnabled(false)}
                    onKeyDown={e => handleKeyDown(e.keyCode)}
                />
            </div>
            <SearchResultListPanel
                input={input}
                query={query}
                enabled={enabled}
                search={search}
                select={selectAndClose}
            />
        </div>
    )
}
