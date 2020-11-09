import React, { useRef, useState, useEffect } from 'react'

import { Resource } from 'app/cache'

import { resources } from '../api'
import { SearchResult, Annotation } from '../types'

import { SearchOverlay } from './SearchOverlay'
import { SearchResultList } from './SearchResultList'

const sources = [
    { value: 'GObp', label: 'GObp' },
    { value: 'GOcc', label: 'GOcc' },
    { value: 'GOmf', label: 'GOmf' },
]

type AnnotationInputProps = {
    select: (annotation: Annotation) => void,
}

export const AnnotationInput: React.FC<AnnotationInputProps> = ({ select }) => {
    const input = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState<string>('')
    const [source, setSource] = useState<string>('')
    const [resource, setResource] = useState<Resource<SearchResult<Annotation>[]>>(resources.annotations(source, query))

    const update = (source: string, query: string) => {
        setQuery(query)
        setSource(source)
        setResource(resources.annotations(source, query))
    }

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
                <AnnotationSourceSelect
                    input={input}
                    source={source}
                    update={(source: string) => update(source, query)}
                />
                <input
                    ref={input}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search for a predefined human annotation"
                    value={query}
                    disabled={source === ''}
                    onChange={e => update(source, e.target.value)}
                />
            </div>
            <SearchOverlay input={input}>
                <SearchResultList
                    input={input}
                    query={query}
                    resource={resource}
                    select={selectAndReset}
                />
            </SearchOverlay>
        </div>
    )
}

type AnnotationSourceSelectProps = {
    input: React.RefObject<HTMLInputElement>
    source: string
    update: (source: string) => void
}

const AnnotationSourceSelect: React.FC<AnnotationSourceSelectProps> = ({ input, source, update }) => {
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
