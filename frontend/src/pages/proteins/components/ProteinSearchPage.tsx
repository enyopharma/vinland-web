import React from 'react'

import { ProteinCard } from 'features/proteins'

export const ProteinSearchPage: React.FC = () => (
    <div className="container">
        <h1>Search for proteins</h1>
        <form action="#" className="form-horizontal" onSubmit={e => e.preventDefault()}>
            <ProteinCard />
        </form>
    </div>
)
