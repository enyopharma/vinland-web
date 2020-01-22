import React, { useRef, useState, useEffect } from 'react'

import { api } from './api'
import { Annotation } from 'search/state/identifier'
import { SearchResultListPanel } from 'search/components/shared/SearchResultListPanel'

type Props = {
    select: (annotation: Annotation) => void
}

const sources = [
    { value: 'GObp', label: 'GObp' },
    { value: 'GOcc', label: 'GOcc' },
    { value: 'GOmf', label: 'GOmf' },
]

export const AnnotationInput: React.FC<Props> = ({ select }) => {
    const input = useRef<HTMLInputElement>(null)
    const [source, setSource] = useState<string>('')
    const [query, setQuery] = useState<string>('')
    const [enabled, setEnabled] = useState<boolean>(false)

    useEffect(() => {
        if (source === '') return
        if (input.current) input.current.focus()
    }, [source])

    useEffect(() => {
        setEnabled(query.trim().length > 0)
    }, [query])

    const search = (query: string) => api.search(source, query)

    const selectAndClose = (annotation: Annotation) => {
        setQuery('')
        select(annotation)
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
