import React, { useRef, useState, useEffect } from 'react'

import { Annotation } from 'features/identifiers'
import { resources } from 'features/identifiers'

import { Overlay, SearchResultList } from 'features/autocomplete'

const sources = [
    { value: 'GObp', label: 'GObp' },
    { value: 'GOcc', label: 'GOcc' },
    { value: 'GOmf', label: 'GOmf' },
]

type Props = {
    select: (annotation: Annotation) => void,
}

const isSourceSelected = (source: string) => source.trim().length > 0

export const AnnotationInput: React.FC<Props> = ({ select }) => {
    const ref = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState<string>('')
    const [source, setSource] = useState<string>('')

    useEffect(() => {
        if (isSourceSelected(source)) {
            ref.current?.focus()
        }
    }, [source])

    const search = (query: string) => resources.annotations(source, query).read()

    const selectAndReset = (annotation: Annotation) => {
        ref.current?.blur()
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
                <select
                    className="form-control form-control-lg col-2"
                    value={source}
                    onChange={e => { setSource(e.target.value) }}
                >
                    <option value="">Source</option>
                    {sources.map((source, i) => (
                        <option key={i} value={source.value}>{source.label}</option>
                    ))}
                </select>
                <input
                    ref={ref}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search for a predefined human annotation"
                    value={query}
                    disabled={source === ''}
                    onChange={e => setQuery(e.target.value)}
                />
            </div>
            <Overlay input={ref}>
                <SearchResultList input={ref} query={query} search={search} select={selectAndReset} />
            </Overlay>
        </div>
    )
}
