import React from 'react'
import { useActionCreator } from 'app'

import { Options } from 'features/options'
import { actions } from 'features/options'

import { FilterOptionsRow } from './FilterOptionsRow'
import { DisplayOptionsRow } from './DisplayOptionsRow'

type Props = {
    options: Options
}

export const OptionsCard: React.FC<Props> = ({ options }) => {
    const setHH = useActionCreator(actions.setHH)
    const setVH = useActionCreator(actions.setVH)
    const setNeighbors = useActionCreator(actions.setNeighbors)
    const setPublications = useActionCreator(actions.setPublications)
    const setMethods = useActionCreator(actions.setMethods)

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
