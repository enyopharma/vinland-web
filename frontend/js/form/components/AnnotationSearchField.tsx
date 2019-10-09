import React, { createRef, useState, useEffect } from 'react'

import { Annotation } from 'form/types'
import { SearchResult } from 'form/types'

import * as api from 'form/api/annotations'

import { SearchField } from './SearchField'

type Props = {
    select: (annotation: Annotation) => void
}

const limit = 5

const init: SearchResult<Annotation> = { query: '', limit: limit, hints: [] }

export const AnnotationSearchField: React.FC<Props> = ({ select }) => {
    const ref = createRef<HTMLInputElement>()

    const [source, setSource] = useState<string>('')
    const [query, setQuery] = useState<string>('')
    const [fetching, setFetching] = useState<boolean>(false)
    const [result, setResult] = useState<SearchResult<Annotation>>(init)

    useEffect(() => {
        if (source.length > 0) ref.current.focus()
    }, [source])

    useEffect(() => {
        if (source.length > 0 && query.trim().length > 0) {
            setFetching(true)

            const timeout = setTimeout(() => {
                api.annotations(source, query, limit).then(result => setResult(result))
            }, 300)

            return () => clearTimeout(timeout)
        }

        setResult(init)
    }, [source, query])

    useEffect(() => setFetching(false), [result])

    const doSelect = (annotation: Annotation) => {
        setSource('')
        setQuery('')
        ref.current.blur()
        select(annotation)
    }

    const onChangeSource = e => setSource(e.target.value)

    const onChangeQuery = e => setQuery(e.target.value)

    return (
        <SearchField<Annotation> result={result} select={doSelect}>
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        {fetching ? '?' : '@'}
                    </span>
                </div>
                <select
                    value={source}
                    onChange={onChangeSource}
                    className="form-control form-control-lg col-2"
                >
                    <option value=""></option>
                    <option value="GObp">GO bp</option>
                    <option value="GOcc">GO cc</option>
                    <option value="GOmf">GO mf</option>
                </select>
                <input
                    ref={ref}
                    type="text"
                    placeholder="Search for a predefined human annotation"
                    className="form-control form-control-lg"
                    value={query}
                    onChange={onChangeQuery}
                    disabled={source == ''}
                />
            </div>
        </SearchField>
    )
}
