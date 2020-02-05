import React from 'react'
import { useActionCreator } from 'app'

import { Options } from 'features/options'
import { creators } from 'features/options'

import { FilterOptionsRow } from './FilterOptionsRow'
import { DisplayOptionsRow } from './DisplayOptionsRow'

type Props = {
    options: Options
}

export const OptionsCard: React.FC<Props> = ({ options }) => {
    const setHH = useActionCreator(creators.setHH)
    const setVH = useActionCreator(creators.setVH)
    const setNeighbors = useActionCreator(creators.setNeighbors)
    const setPublications = useActionCreator(creators.setPublications)
    const setMethods = useActionCreator(creators.setMethods)

    return (
        <div className="card">
            <div className="card-body">
                <DisplayOptionsRow
                    hh={options.hh}
                    vh={options.vh}
                    neighbors={options.neighbors}
                    setHH={setHH}
                    setVH={setVH}
                    setNeighbors={setNeighbors}
                />
                <FilterOptionsRow
                    publications={options.publications}
                    methods={options.methods}
                    setPublications={setPublications}
                    setMethods={setMethods}
                />
            </div>
        </div>
    )
}
