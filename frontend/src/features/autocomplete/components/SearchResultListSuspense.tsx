import React, { RefObject } from 'react'

import { SearchResult } from 'features/autocomplete'

const SearchResultList = React.lazy(() => import('./SearchResultList').then(module => ({ default: module.SearchResultList })))

type Props = {
    input: RefObject<HTMLInputElement>
    query: string,
    select: (value: any) => void
    search: (query: string) => SearchResult<any>[]
}

export const SearchResultListSuspense: React.FC<Props> = (props) => (
    <React.Suspense fallback={<Fallback />}>
        <Fetcher {...props} />
    </React.Suspense>
)

const Fetcher: React.FC<Props> = ({ query, search, ...props }) => {
    const results = search(query)

    return <SearchResultList query={query} results={results} {...props} />
}

const Fallback: React.FC = () => (
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
