import React, { RefObject, useState, useEffect, useCallback } from 'react'

import { SearchResult } from 'features/autocomplete'

type Props = {
    input: RefObject<HTMLInputElement>
    query: string,
    select: (value: any) => void
}

type PropsWithSearch = Props & {
    search: () => SearchResult<any>[]
}

type PropsWithResults = Props & {
    results: SearchResult<any>[]
}

export const SearchResultList: React.FC<PropsWithSearch> = (props) => (
    <React.Suspense fallback={<ListWithProgressBar />}>
        <ListFetcher {...props} />
    </React.Suspense>
)

const ListFetcher: React.FC<PropsWithSearch> = ({ search, ...props }) => {
    const results = search()

    return <ListWithResults {...props} results={results} />
}

const ListWithProgressBar: React.FC = () => (
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

const ListWithResults: React.FC<PropsWithResults> = ({ input, query, select, results }) => {
    const [active, setActive] = useState<number>(0)

    useEffect(() => setActive(0), [query])

    const active1 = results.length === 0 ? 0 : active % results.length
    const active2 = active1 >= 0 ? active1 : active1 + results.length

    const regex = query.trim()
        .replace(/\s*\+$/, '')
        .replace(/\s*\+\s*/g, '|');

    const handleKeyDown = useCallback((e: any) => {
        if (e.keyCode === 38) setActive(active - 1)
        if (e.keyCode === 40) setActive(active + 1)
        if (e.keyCode === 13 && results[active]) {
            select(results[active].value)
        }
    }, [select, results, active])

    const highlight = useCallback((label: string) => {
        return regex.length > 0
            ? label.replace(new RegExp('(' + regex + ')', 'gi'), '<strong>$1</strong>')
            : label
    }, [regex])

    if (input.current) input.current.onkeydown = handleKeyDown

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
