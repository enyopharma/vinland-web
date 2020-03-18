import React, { RefObject, useState, useEffect } from 'react'

import { SearchResult } from 'features/autocomplete'

type Props = {
    input: RefObject<HTMLInputElement>
    query: string,
    select: (value: any) => void
    search: (query: string) => SearchResult<any>[]
}

export const SearchResultList: React.FC<Props> = (props) => (
    <React.Suspense fallback={<ListFallback />}>
        <ListLoader {...props} />
    </React.Suspense>
)

const ListFallback: React.FC = () => (
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

const ListLoader: React.FC<Props> = ({ input, search, query, select }) => {
    const results = search(query)

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
                    No entry found
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
