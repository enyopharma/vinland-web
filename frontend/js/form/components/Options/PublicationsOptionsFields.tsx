import React from 'react'

import { PublicationsOptions } from 'form/types'

type Props = {
    value: PublicationsOptions
    update: (value: PublicationsOptions) => void
}

export const PublicationsOptionsFields: React.FC<Props> = ({ value, update }) => {
    const merge = (options): PublicationsOptions => Object.assign({}, value, options)

    const onChange = e => update(merge({ threshold: parseInt(e.target.value) }))

    return (
        <React.Fragment>
            <label htmlFor="publications">
                At least {value.threshold} publications describing PPIs
            </label>
            <input
                id="publications"
                type="range"
                min="1"
                max="10"
                value={value.threshold}
                onChange={onChange}
                className="form-control-range"
            />
        </React.Fragment>
    )
}
