import React from 'react'

import { ToastContainer } from '../toast'
import { TaxonomyCard } from './TaxonomyCard'
import { IdentifierCard } from './IdentifierCard'
import { DisplayOptionsCard } from './DisplayOptionsCard'
import { QueryResultSection } from './QueryResultSection'

export const InteractionSearchPage: React.FC = () => (
    <div className="container">
        <h1>Search for interactions</h1>
        <form action="#" className="form-horizontal" onSubmit={e => e.preventDefault()}>
            <fieldset className="mb-4">
                <legend>Human protein identifiers</legend>
                <IdentifierCard />
            </fieldset>
            <fieldset className="mb-4">
                <legend>Viral taxonomy</legend>
                <TaxonomyCard />
            </fieldset>
            <fieldset className="mb-4">
                <legend>PPI display options</legend>
                <DisplayOptionsCard />
            </fieldset>
        </form>
        <h2 id="result">Query result</h2>
        <ToastContainer target='result' />
        <QueryResultSection />
    </div>
)
