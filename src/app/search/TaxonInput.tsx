import React, { useRef, useState } from 'react'

import { TaxonSelection, Taxon, isSelectedTaxon, read } from './src/taxon'
import { SearchResultPanel } from './SearchResultPanel'

type Props = {
    taxon: TaxonSelection
    select: (taxon: Taxon) => void
    unselect: () => void
}

const search = read(5)

export const TaxonInput: React.FC<Props> = ({ taxon, select, unselect }) => {
    const input = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState<string>('')
    const [enabled, setEnabled] = useState<boolean>(false)

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

    if (isSelectedTaxon(taxon)) {
        return (
            <div className="alert alert-danger">
                {taxon.name}
                <button type="button" className="close" onClick={e => unselect()}>
                    &times;
                </button>
            </div>
        )
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
            <SearchResultPanel
                input={input}
                query={query}
                enabled={enabled}
                search={search}
                select={selectAndClose}
            />
        </div>
    )
}
