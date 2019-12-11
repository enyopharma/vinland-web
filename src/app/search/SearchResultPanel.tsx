import React, { RefObject, useState, useEffect } from 'react'

import { SearchResult } from './src/shared'

type Props = {
    input: RefObject<HTMLInputElement>
    query: string,
    enabled: boolean,
    search: (query: string) => SearchResult<any>[]
    select: (value: any) => void
}

const SearchLoader: React.FC = () => (
    <ul className="list-group">
        <li className="list-group-item">
            <div className="progress">
                <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                    style={{ width: '100%' }}
                ></div>
            </div>
        </li>
    </ul>
)

const SearchResultList: React.FC<Props> = ({ input, query, search, select }) => {
    const results = search(query)

    const [active, setActive] = useState<number>(0)

    useEffect(() => setActive(0), [query])

    if (input.current) input.current.onkeydown = (e: any) => {
        if (e.keyCode === 38) setActive(active - 1)
        if (e.keyCode === 40) setActive(active + 1)
        if (e.keyCode === 13 && results[active]) {
            select(results[active].value)
        }
    }

    const active1 = results.length === 0 ? 0 : active % results.length
    const active2 = active1 >= 0 ? active1 : active1 + results.length

    const regex = query.trim()
        .replace(/\s*\+$/, '')
        .replace(/\s*\+\s*/g, '|');

    const highlight = (label: string) => {
        return regex.length > 0
            ? label.replace(new RegExp('(' + regex + ')', 'gi'), '<strong>$1</strong>')
            : label
    }

    return (
        <ul className="list-group">
            {results.length > 0 ? null : (
                <li className="list-group-item">
                    No entry found
                </li>
            )}
            {results.map((result, i) => (
                <li
                    key={i}
                    className={'list-group-item' + (i === active2 ? ' active' : '')}
                    dangerouslySetInnerHTML={{ __html: highlight(result.label) }}
                    onMouseDown={e => select(result.value)}
                    onMouseOver={e => setActive(i)}
                ></li>
            ))}
        </ul>
    )
}

export const SearchResultPanel: React.FC<Props> = (props) => {
    return !props.enabled || props.query.trim().length === 0 ? null : (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', width: '100%', zIndex: 100 }}>
                <React.Suspense fallback={<SearchLoader />}>
                    <SearchResultList {...props} />
                </React.Suspense>
            </div>
        </div>
    )
}
