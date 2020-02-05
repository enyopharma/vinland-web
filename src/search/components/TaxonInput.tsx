import React, { useRef, useState, useCallback } from 'react'

import { Overlay } from 'app/components/Overlay'
import { SearchResultList } from 'app/components/SearchResultList'

import { Taxon } from 'search/features/taxonomy'
import { cache } from 'search/api/taxa'

type Props = {
    select: (taxon: Taxon) => void,
}

export const TaxonInput: React.FC<Props> = ({ select }) => {
    const input = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState<string>('')
    const [enabled, setEnabled] = useState<boolean>(false)

    const search = useCallback(() => {
        return cache.read(query)
    }, [query])

    const selectAndClose = useCallback((taxon: Taxon) => {
        setEnabled(false)
        select(taxon)
    }, [select])

    const handleKeyDown = useCallback((code: number) => {
        if (input.current && code === 27) {
            input.current.blur()
        }
    }, [input])

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
            <Overlay display={enabled && query.trim().length > 0}>
                <SearchResultList input={input} query={query} search={search} select={selectAndClose} />
            </Overlay>
        </div>
    )
}
