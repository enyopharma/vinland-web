import React, { useRef, useState, useEffect } from 'react'

import { resources } from '../api'
import { Annotation } from '../types'

import { Overlay, SearchResultList } from 'partials'

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
    const [query, setQuery] = useState<string>('')
    const [source, setSource] = useState<string>('')

    const search = (query: string) => resources.annotations(source, query).read()

    const selectAndReset = (annotation: Annotation) => {
        input.current?.blur()
        setSource('')
        setQuery('')
        select(annotation)
    }

    return (
        <div className="form-group">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">@</span>
                </div>
                <Select input={input} source={source} update={setSource} />
                <input
                    ref={input}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search for a predefined human annotation"
                    value={query}
                    disabled={source === ''}
                    onChange={e => setQuery(e.target.value)}
                />
            </div>
            <Overlay input={input}>
                <SearchResultList input={input} query={query} search={search} select={selectAndReset} />
            </Overlay>
        </div>
    )
}

type SelectProps = {
    input: React.RefObject<HTMLInputElement>
    source: string
    update: (source: string) => void
}

const Select: React.FC<SelectProps> = ({ input, source, update }) => {
    useEffect(() => { if (source.trim().length > 0) input.current?.focus() }, [input, source])

    return (
        <select
            className="form-control form-control-lg col-2"
            value={source}
            onChange={e => update(e.target.value)}
        >
            <option value="">Source</option>
            {sources.map((source, i) => (
                <option key={i} value={source.value}>{source.label}</option>
            ))}
        </select>
    )
}
