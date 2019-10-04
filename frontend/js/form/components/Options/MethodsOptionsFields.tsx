import React from 'react'

import { MethodsOptions } from 'form/types'

type Props = {
    value: MethodsOptions
    update: (value: MethodsOptions) => void
}

export const MethodsOptionsFields: React.FC<Props> = ({ value, update }) => {
    const merge = (options): MethodsOptions => Object.assign({}, value, options)

    const onChange = e => update(merge({ threshold: parseInt(e.target.value) }))

    return (
        <React.Fragment>
            <label htmlFor="methods">
                At least {value.threshold} methods describing PPIs
            </label>
            <input
                id="methods"
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
