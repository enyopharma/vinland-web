import React, { RefObject, useState, useEffect } from 'react'

import { SearchResult } from '../types'
import { ProgressBar } from './ProgressBar'

type Props = {
    input: RefObject<HTMLInputElement>
    query: string,
    search: (value: string) => SearchResult<any>[]
    select: (value: any) => void
}

export const SearchResultList: React.FC<Props> = (props) => (
    <React.Suspense fallback={<Fallback />}>
        <Fetcher {...props} />
    </React.Suspense>
)

const Fallback: React.FC = () => (
    <ul className="list-group">
        <li className="list-group-item">
            <ProgressBar />
        </li>
    </ul>
)

const Fetcher: React.FC<Props> = ({ query, search, ...props }) => {
    const results = search(query)

    return <Ul query={query} results={results} {...props} />
}

type UlProps = {
    input: RefObject<HTMLInputElement>
    query: string,
    results: SearchResult<any>[]
    select: (value: any) => void
}

const Ul: React.FC<UlProps> = ({ input, query, results, select, children }) => {
    const [active, setActive] = useState<number>(0)

    const active1 = results.length === 0 ? 0 : active % results.length
    const active2 = active1 >= 0 ? active1 : active1 + results.length

    const regex = query.trim()
        .replace(/\s*\+$/, '')
        .replace(/\s*\+\s*/g, '|');

    const highlighted = results.map(result => regex.length > 0
        ? { value: result.value, label: result.label.replace(new RegExp(`(${regex})`, 'gi'), '<strong>$1</strong>') }
        : result
    )

    const keydown = (e: KeyboardEvent) => {
        if (e.keyCode === 38) setActive(active - 1)
        if (e.keyCode === 40) setActive(active + 1)
        if (e.keyCode === 13 && results[active2]) {
            select(results[active2].value)
        }
    }

    useEffect(() => setActive(0), [results])

    useEffect(() => {
        const elem = input.current

        elem?.addEventListener('keydown', keydown)

        return () => { elem?.removeEventListener('keydown', keydown) }
    })

    return (
        <ul className="list-group">
            {results.length > 0 ? null : (
                <li className="list-group-item">
                    {children ?? 'No entry found'}
                </li>
            )}
            {highlighted.map((result, i) => (
                <li
                    key={i}
                    className={i === active2 ? 'list-group-item active' : 'list-group-item'}
                    dangerouslySetInnerHTML={{ __html: result.label }}
                    onMouseDown={e => select(result.value)}
                    onMouseOver={e => setActive(i)}
                ></li>
            ))}
        </ul>
    )
}
