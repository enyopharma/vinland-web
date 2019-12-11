import React, { useRef, useState, useEffect } from 'react'

import { Annotation, read } from './src/annotation'
import { SearchResultPanel } from './SearchResultPanel'

type Props = {
    select: (annotation: Annotation) => void
}

const annotations = read(5)

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

    const search = (query: string) => annotations(source, query)

    const selectAndEmpty = (annotation: Annotation) => {
        setQuery('')
        select(annotation)
    }

    const handleKeyDown = (code: number) => {
        if (code === 27) setEnabled(!enabled)
        if (code === 38) setEnabled(true)
        if (code === 40) setEnabled(true)
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
                    <option value=""></option>
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
                    onClick={e => setEnabled(true)}
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
                select={selectAndEmpty}
            />
        </div>
    )
}
