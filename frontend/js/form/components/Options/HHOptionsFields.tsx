import React from 'react'

import { HHOptions } from 'form/types'

type Props = {
    value: HHOptions
    update: (value: HHOptions) => void
}

export const HHOptionsFields: React.FC<Props> = ({ value, update }) => {
    const merge = (options): HHOptions => Object.assign({}, value, options)

    const onShowChange = e => update(merge({ show: e.target.checked }))
    const onNetworkChange = e => update(merge({ network: e.target.checked }))

    return (
        <React.Fragment>
            <div className="form-check form-check-inline">
                <input
                    id="hh"
                    type="checkbox"
                    checked={value.show}
                    onChange={onShowChange}
                    className="form-check-input"
                />
                <label className="form-check-label" htmlFor="hh">
                    Show HH ppi
                </label>
            </div>
            <div className="form-check form-check-inline">
                <input
                    id="network"
                    type="checkbox"
                    checked={value.network}
                    onChange={onNetworkChange}
                    className="form-check-input"
                    disabled={!value.show}
                />
                <label className="form-check-label" htmlFor="network">
                    Network only for HH
                </label>
            </div>
        </React.Fragment>
    )
}
