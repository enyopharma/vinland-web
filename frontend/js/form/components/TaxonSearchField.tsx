import React, { useState, useEffect } from 'react'

import { SearchResult } from 'form/types'
import { Taxon, TaxonSelection, isSelectedTaxon } from 'form/types'

import * as api from 'form/api/taxa'

import { SearchField } from './SearchField'

type Props = {
    selection: TaxonSelection,
    select: (taxon: Taxon) => void
    unselect: () => void
}

const limit = 5

const init: SearchResult<Taxon> = { query: '', limit: limit, hints: [] }

export const TaxonSearchField: React.FC<Props> = ({ selection, select, unselect }) => {
    const [query, setQuery] = useState<string>('');
    const [fetching, setFetching] = useState<boolean>(false);
    const [result, setResult] = useState<SearchResult<Taxon>>(init);

    useEffect(() => {
        if (query.trim().length > 0) {
            setFetching(true)

            const timeout = setTimeout(() => {
                api.taxa(query, limit).then(result => setResult(result))
            }, 300)

            return () => clearTimeout(timeout)
        }

        setResult(init)
    }, [query])

    useEffect(() => { setFetching(false) }, [result])

    if (isSelectedTaxon(selection)) {
        const onClick = e => unselect()

        return (
            <div className="alert alert-danger">
                {selection.name}
                <button type="button" className="close" onClick={onClick}>
                    &times;
                </button>
            </div>
        )
    }

    const onChange = e => setQuery(e.target.value)

    return (
        <SearchField<Taxon> result={result} select={select}>
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        {fetching ? '?' : '@'}
                    </span>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={onChange}
                    className="form-control form-control-lg"
                />
            </div>
        </SearchField>
    )
}
