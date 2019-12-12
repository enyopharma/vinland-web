import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { TaxonContainer } from './TaxonContainer'
import { OptionsContainer } from './OptionsContainer'
import { IdentifiersContainer } from './IdentifiersContainer'
import { QueryResultContainer } from './QueryResultContainer'

const scrollToResult = () => {
    const results = window.document.getElementById('results')
    if (results) {
        results.scrollIntoView(true);
    }
}

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
        <ToastContainer
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            rtl={false}
            draggable={false}
            closeOnClick={true}
            closeButton={false}
            position={toast.POSITION.BOTTOM_RIGHT}
            onClick={scrollToResult}
        />
    </div>
)
