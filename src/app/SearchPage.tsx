import React from 'react'

import { ToastContainer } from './search/ToastContainer'
import { TaxonContainer } from './search/TaxonContainer'
import { OptionsContainer } from './search/OptionsContainer'
import { IdentifiersContainer } from './search/IdentifiersContainer'
import { QueryResultContainer } from './search/QueryResultContainer'

export const SearchPage: React.FC = () => (
    <div className="container">
        <h1>Search for interactions</h1>
        <form action="#" className="form-horizontal" onSubmit={e => e.preventDefault()}>
            <fieldset>
                <legend>Human protein identifiers</legend>
                <IdentifiersContainer />
            </fieldset>
            <fieldset>
                <legend>Viral taxon</legend>
                <TaxonContainer />
            </fieldset>
            <fieldset>
                <legend>PPI filter options</legend>
                <OptionsContainer />
            </fieldset>
        </form>
        <h2 id="results">Query result</h2>
        <QueryResultContainer />
        <ToastContainer />
    </div>
)
