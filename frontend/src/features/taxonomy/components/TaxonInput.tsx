import React, { useRef, useState } from 'react'

import { useActionCreator } from 'app'

import { actions, resources } from 'features/taxonomy'

import { Overlay, SearchResultListSuspense } from 'partials'

const search = (query: string) => resources.taxa(query).read()

export const TaxonInput: React.FC = () => {
    const select = useActionCreator(actions.select)

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
                <SearchResultListSuspense
                    input={ref}
                    query={query}
                    search={search}
                    select={select}
                />
            </Overlay>
        </div>
    )
}
