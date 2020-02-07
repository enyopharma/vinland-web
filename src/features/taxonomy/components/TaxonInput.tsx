import React, { useRef, useState, useCallback } from 'react'

import { Taxon } from 'features/taxonomy'
import { resources } from 'features/taxonomy'

import { Overlay, SearchResultList } from 'features/autocomplete'

type Props = {
    select: (taxon: Taxon) => void,
}

export const TaxonInput: React.FC<Props> = ({ select }) => {
    const input = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState<string>('')
    const [enabled, setEnabled] = useState<boolean>(false)

    const search = useCallback(() => {
        return resources.taxa(query).read()
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
