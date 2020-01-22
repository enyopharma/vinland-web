import React from 'react'

import { FilterOptionsRow } from './FilterOptionsRow'
import { DisplayOptionsRow } from './DisplayOptionsRow'

type Props = {
    hh: boolean
    vh: boolean
    neighbors: boolean
    publications: number
    methods: number
    setHH: (hh: boolean) => void
    setVH: (vh: boolean) => void
    setNeighbors: (neighbors: boolean) => void
    setPublications: (threshold: number) => void
    setMethods: (threshold: number) => void
}

export const OptionsCard: React.FC<Props> = (props) => (
    <div className="card">
        <div className="card-body">
            <DisplayOptionsRow {...props} />
            <FilterOptionsRow {...props} />
        </div>
    </div>
)
