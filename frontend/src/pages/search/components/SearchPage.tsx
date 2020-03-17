import React from 'react'

import { useAppSelector } from 'app'

import { state2query } from 'pages/search'

import { OptionsCard } from 'features/options'
import { TaxonomyCard } from 'features/taxonomy'
import { ToastContainer } from 'features/toast'
import { IdentifierCard } from 'features/identifiers'
import { QueryResultSection } from 'features/query'

export const SearchPage: React.FC = () => {
    const lists = useAppSelector(state => state.search.identifiers)
    const taxonomy = useAppSelector(state => state.search.taxonomy)
    const options = useAppSelector(state => state.search.options)
    const query = useAppSelector(state2query)

    return (
        <div className="container">
            <h1>Search for interactions</h1>
            <form action="#" className="form-horizontal" onSubmit={e => e.preventDefault()}>
                <fieldset>
                    <legend>Human protein identifiers</legend>
                    <IdentifierCard lists={lists} />
                </fieldset>
                <fieldset>
                    <legend>Viral taxonomy</legend>
                    <TaxonomyCard taxonomy={taxonomy} />
                </fieldset>
                <fieldset>
                    <legend>PPI display options</legend>
                    <OptionsCard options={options} />
                </fieldset>
            </form>
            <h2 id="result">Query result</h2>
            <ToastContainer target='result' />
            <QueryResultSection query={query} />
        </div>
    )
}
