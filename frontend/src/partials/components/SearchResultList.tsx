import React, { RefObject, useState, useEffect } from 'react'

import { SearchResult } from 'partials'

type Props = {
    input: RefObject<HTMLInputElement>
    query: string,
    results: SearchResult<any>[]
    select: (value: any) => void
}

export const SearchResultList: React.FC<Props> = ({ input, query, results, select, children }) => {
    const [active, setActive] = useState<number>(0)

    const active1 = results.length === 0 ? 0 : active % results.length
    const active2 = active1 >= 0 ? active1 : active1 + results.length

    useEffect(() => setActive(0), [results])

    useEffect(() => {
        if (input.current) {
            const target = input.current

            const keydown = (e: KeyboardEvent) => {
                if (e.keyCode === 38) setActive(active - 1)
                if (e.keyCode === 40) setActive(active + 1)
                if (e.keyCode === 13 && results[active2]) {
                    select(results[active2].value)
                }
            }

            target.addEventListener('keydown', keydown)

            return () => { target.removeEventListener('keydown', keydown) }
        }
    })

    const regex = query.trim()
        .replace(/\s*\+$/, '')
        .replace(/\s*\+\s*/g, '|');

    const highlight = (label: string) => regex.length > 0
        ? label.replace(new RegExp(`(${regex})`, 'gi'), '<strong>$1</strong>')
        : label

    return (
        <ul className="list-group">
            {results.length > 0 ? null : (
                <li className="list-group-item">
                    {children ?? 'No entry found'}
                </li>
            )}
            {results.map((result, i) => (
                <li
                    key={i}
                    className={i === active2 ? 'list-group-item active' : 'list-group-item'}
                    dangerouslySetInnerHTML={{ __html: highlight(result.label) }}
                    onMouseDown={e => select(result.value)}
                    onMouseOver={e => setActive(i)}
                ></li>
            ))}
        </ul>
    )
}
