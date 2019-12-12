import React from 'react'

import { TaxonContainer } from './TaxonContainer'
import { OptionsContainer } from './OptionsContainer'
import { IdentifiersContainer } from './IdentifiersContainer'
import { QueryResultContainer } from './QueryResultContainer'

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
        <h2>Query result</h2>
        <QueryResultContainer />
    </div>
)
