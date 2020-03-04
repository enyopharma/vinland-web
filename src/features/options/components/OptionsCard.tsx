import React from 'react'

import { useActionCreator } from 'app'

import { Options } from 'features/options'
import { actions } from 'features/options'

type Props = {
    options: Options
}

export const OptionsCard: React.FC<Props> = (props) => (
    <div className="card">
        <div className="card-body">
            <DisplayOptionsRow {...props} />
            <FilterOptionsRow {...props} />
        </div>
    </div>
)

const DisplayOptionsRow: React.FC<Props> = ({ options }) => {
    const { hh, vh, neighbors } = options

    const setHH = useActionCreator(actions.setHH)
    const setVH = useActionCreator(actions.setVH)
    const setNeighbors = useActionCreator(actions.setNeighbors)

    return (
        <div className="row">
            <div className="col">
                <div className="form-check form-check-inline">
                    <input
                        id="hh"
                        type="checkbox"
                        className="form-check-input"
                        checked={hh}
                        onChange={e => setHH(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="hh">
                        Show HH ppi
                    </label>
                </div>
            </div>
            <div className="col">
                <div className="form-check form-check-inline">
                    <input
                        id="vh"
                        type="checkbox"
                        className="form-check-input"
                        checked={vh}
                        onChange={e => setVH(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="vh">
                        Show VH ppi
                    </label>
                </div>
            </div>
            <div className="col-6">
                <div className="form-check form-check-inline">
                    <input
                        id="neighbors"
                        type="checkbox"
                        className="form-check-input"
                        checked={hh && neighbors}
                        onChange={e => setNeighbors(e.target.checked)}
                        disabled={!hh}
                    />
                    <label className="form-check-label" htmlFor="neighbors">
                        Include human neighbors
                    </label>
                </div>
            </div>
        </div>
    )
}

const FilterOptionsRow: React.FC<Props> = ({ options }) => {
    const { publications, methods } = options

    const setPublications = useActionCreator(actions.setPublications)
    const setMethods = useActionCreator(actions.setMethods)

    return (
        <div className="row">
            <div className="col">
                <label htmlFor="publications">
                    {`At least ${publications} ${publications === 1 ? 'publication' : 'publications'} describing PPIs`}
                </label>
                <input
                    id="publications"
                    type="range"
                    className="custom-range"
                    value={publications}
                    min="1"
                    max="10"
                    onChange={e => setPublications(parseInt(e.target.value))}
                />
            </div>
            <div className="col">
                <label htmlFor="publications">
                    {`At least ${methods} ${methods === 1 ? 'method' : 'methods'} describing PPIs`}
                </label>
                <input
                    id="publications"
                    type="range"
                    className="custom-range"
                    value={methods}
                    min="1"
                    max="10"
                    onChange={e => setMethods(parseInt(e.target.value))}
                />
            </div>
        </div>
    )
}
