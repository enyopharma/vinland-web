import React, { useRef, useState } from 'react'

import { Taxon } from 'features/taxonomy'
import { resources } from 'features/taxonomy'

import { Overlay, SearchResultList } from 'features/autocomplete'

type Props = {
    select: (taxon: Taxon) => void,
}

const search = (query: string) => resources.taxa(query).read()

export const TaxonInput: React.FC<Props> = ({ select }) => {
    const ref = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState<string>('')

    return (
        <div className="form-group">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">@</span>
                </div>
                <input
                    ref={ref}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search for a viral species"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
            </div>
            <Overlay input={ref}>
                <SearchResultList input={ref} query={query} search={search} select={select} />
            </Overlay>
        </div>
    )
}
