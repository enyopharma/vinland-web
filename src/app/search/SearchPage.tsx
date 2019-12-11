import React from 'react'

import { TaxonCard } from './TaxonCard'
import { OptionsCard } from './OptionsCard'
import { IdentifierCard } from './IdentifierCard'

export const SearchPage: React.FC = () => (
    <div className="container">
        <h1>Search for interactions</h1>
        <form action="#" className="form-horizontal" onSubmit={e => e.preventDefault()}>
            <fieldset>
                <legend>Human protein identifiers</legend>
                <IdentifierCard />
            </fieldset>
            <fieldset>
                <legend>Viral taxon</legend>
                <TaxonCard />
            </fieldset>
            <fieldset>
                <legend>PPI display options</legend>
                <OptionsCard />
            </fieldset>
        </form>
    </div>
)
