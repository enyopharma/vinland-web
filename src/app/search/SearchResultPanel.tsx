import React, { RefObject } from 'react'

import { SearchResult } from './src/shared'

import { SearchResultList } from './SearchResultList'

type Props = {
    input: RefObject<HTMLInputElement>
    query: string,
    enabled: boolean,
    search: (query: string) => SearchResult<any>[]
    select: (value: any) => void
}

const SearchResultLoader: React.FC = () => (
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

const SearchResultFetcher: React.FC<Props> = ({ input, query, search, select }) => {
    const results = search(query)

    return <SearchResultList input={input} query={query} results={results} select={select} />
}

export const SearchResultPanel: React.FC<Props> = (props) => {
    return !props.enabled || props.query.trim().length === 0 ? null : (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', width: '100%', zIndex: 100 }}>
                <React.Suspense fallback={<SearchResultLoader />}>
                    <SearchResultFetcher {...props} />
                </React.Suspense>
            </div>
        </div>
    )
}
