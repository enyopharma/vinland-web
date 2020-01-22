import React from 'react'

import { ToastContainer } from './toast/ToastContainer'
import { ConnectedVirusCard } from './taxon/ConnectedVirusCard'
import { ConnectedOptionsCard } from './options/ConnectedOptionsCard'
import { ConnectedIdentifierCard } from './identifier/ConnectedIdentifierCard'
import { ConnectedQueryResultCard } from './query/ConnectedQueryResultCard'

export const SearchPage: React.FC = () => (
    <div className="container">
        <h1>Search for interactions</h1>
        <form action="#" className="form-horizontal" onSubmit={e => e.preventDefault()}>
            <fieldset>
                <legend>Human protein identifiers</legend>
                <ConnectedIdentifierCard />
            </fieldset>
            <fieldset>
                <legend>Virus protein selection</legend>
                <ConnectedVirusCard />
            </fieldset>
            <fieldset>
                <legend>PPI display options</legend>
                <ConnectedOptionsCard />
            </fieldset>
        </form>
        <h2 id="results">Query result</h2>
        <ConnectedQueryResultCard />
        <ToastContainer target="results" />
    </div>
)
