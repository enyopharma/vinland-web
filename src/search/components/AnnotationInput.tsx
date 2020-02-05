import React, { useState, useEffect, useCallback, useRef } from 'react'

import { Overlay } from 'app/components/Overlay'
import { SearchResultList } from 'app/components/SearchResultList'

import { Annotation } from 'search/features/identifiers'
import { cache } from 'search/api/annotations'

const sources = [
    { value: 'GObp', label: 'GObp' },
    { value: 'GOcc', label: 'GOcc' },
    { value: 'GOmf', label: 'GOmf' },
]

type Props = {
    select: (annotation: Annotation) => void,
}

export const AnnotationInput: React.FC<Props> = ({ select }) => {
    const input = useRef<HTMLInputElement>(null)
    const [source, setSource] = useState<string>('')
    const [query, setQuery] = useState<string>('')
    const [enabled, setEnabled] = useState<boolean>(false)

    useEffect(() => {
        if (input.current && source.trim().length > 0) {
            input.current.focus()
        }
    }, [source])

    useEffect(() => {
        setEnabled(query.trim().length > 0)
    }, [query])

    const search = useCallback(() => {
        return cache.read(source, query)
    }, [source, query])

    const selectAndClose = useCallback((annotation: Annotation) => {
        setQuery('')
        select(annotation)
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
                <select
                    className="form-control form-control-lg col-2"
                    value={source}
                    onChange={e => setSource(e.target.value)}
                >
                    <option value="">Source</option>
                    {sources.map((source, i) => (
                        <option key={i} value={source.value}>{source.label}</option>
                    ))}
                </select>
                <input
                    ref={input}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search for a predefined human annotation"
                    value={query}
                    disabled={source === ''}
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
