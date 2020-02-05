import React from 'react'
import { useSelector, useActionCreator } from 'search/state'

import { creators } from 'search/features/options'

import { FilterOptionsRow } from './FilterOptionsRow'
import { DisplayOptionsRow } from './DisplayOptionsRow'

export const OptionsCard: React.FC = () => {
    const hh = useSelector(search => search.options.hh)
    const vh = useSelector(search => search.options.vh)
    const neighbors = useSelector(search => search.options.neighbors)
    const methods = useSelector(search => search.options.methods)
    const publications = useSelector(search => search.options.publications)
    const setHH = useActionCreator(creators.setHH)
    const setVH = useActionCreator(creators.setVH)
    const setNeighbors = useActionCreator(creators.setNeighbors)
    const setPublications = useActionCreator(creators.setPublications)
    const setMethods = useActionCreator(creators.setMethods)

    return (
        <div className="card">
            <div className="card-body">
                <DisplayOptionsRow
                    hh={hh}
                    vh={vh}
                    neighbors={neighbors}
                    setHH={setHH}
                    setVH={setVH}
                    setNeighbors={setNeighbors}
                />
                <FilterOptionsRow
                    publications={publications}
                    methods={methods}
                    setPublications={setPublications}
                    setMethods={setMethods}
                />
            </div>
        </div>
    )
}
