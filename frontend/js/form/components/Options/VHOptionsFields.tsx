import React from 'react'

import { VHOptions } from 'form/types'

type Props = {
    value: VHOptions
    update: (value: VHOptions) => void
}

export const VHOptionsFields: React.FC<Props> = ({ value, update }) => {
    const merge = (options): VHOptions => Object.assign({}, value, options)

    const onShowChange = e => update(merge({ show: e.target.checked }))

    return (
        <div className="form-check form-check-inline">
            <input
                id="vh"
                type="checkbox"
                checked={value.show}
                onChange={onShowChange}
                className="form-check-input"
            />
            <label className="form-check-label" htmlFor="vh">
                Show VH ppi
            </label>
        </div>
    )
}
