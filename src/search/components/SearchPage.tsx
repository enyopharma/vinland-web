import React from 'react'

import { TaxonCard } from './TaxonCard'
import { OptionsCard } from './OptionsCard'
import { ToastContainer } from './ToastContainer'
import { IdentifierCard } from './IdentifierCard'
import { QueryResultCard } from './QueryResultCard'

export const SearchPage: React.FC = () => (
    <div className="container">
        <h1>Search for interactions</h1>
        <form action="#" className="form-horizontal" onSubmit={e => e.preventDefault()}>
            <fieldset>
                <legend>Human protein identifiers</legend>
                <IdentifierCard />
            </fieldset>
            <fieldset>
                <legend>Virus protein selection</legend>
                <TaxonCard />
            </fieldset>
            <fieldset>
                <legend>PPI display options</legend>
                <OptionsCard />
            </fieldset>
        </form>
        <h2 id="results">Query result</h2>
        <ToastContainer target="results" />
        <QueryResultCard />
    </div>
)
