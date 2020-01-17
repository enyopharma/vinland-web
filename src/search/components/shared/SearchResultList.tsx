import React, { RefObject, useState, useEffect } from 'react'

import { SearchResult } from 'search/state/input'

type Props = {
    input: RefObject<HTMLInputElement>
    query: string,
    results: SearchResult<any>[]
    select: (value: any) => void
}

export const SearchResultList: React.FC<Props> = ({ input, query, results, select }) => {
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
