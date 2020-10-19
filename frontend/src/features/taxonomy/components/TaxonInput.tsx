import React, { useRef, useState } from 'react'

import { useActionCreator } from 'app/hooks'
import { Overlay, SearchResultList } from 'app/partials'

import { resources } from '../api'
import { actions } from '../reducer'

const search = (query: string) => resources.taxa(query).read()

export const TaxonInput: React.FC = () => {
    const select = useActionCreator(actions.select)

    const input = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState<string>('')

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
                />
            </div>
            <Overlay input={input}>
                <SearchResultList input={input} query={query} search={search} select={select} />
            </Overlay>
        </div>
    )
}
