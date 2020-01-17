import React from 'react'

import { FilterOptionsRow } from './FilterOptionsRow'
import { DisplayOptionsRow } from './DisplayOptionsRow'

type Props = {
    hh: boolean
    vh: boolean
    network: boolean
    publications: number
    methods: number
    setShowHH: (show: boolean) => void
    setShowVH: (show: boolean) => void
    setNetwork: (show: boolean) => void
    setPublicationsThreshold: (threshold: number) => void
    setMethodsThreshold: (threshold: number) => void
}

export const OptionsCard: React.FC<Props> = (props) => (
    <div className="card">
        <div className="card-body">
            <DisplayOptionsRow {...props} />
            <FilterOptionsRow {...props} />
        </div>
    </div>
)
