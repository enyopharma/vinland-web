import React, { useState, useEffect } from 'react'

type Props = {
    identifiers: string[]
    update: (value: string) => void
}

export const IdentifierField: React.FC<Props> = ({ identifiers, update }) => {
    const [value, setValue] = useState<string>(identifiers.join(', '))

    useEffect(() => { update(value) }, [value])

    const onChange = e => setValue(e.target.value)

    return (
        <React.Fragment>
            <textarea className="form-control form-control-lg" value={value} onChange={onChange} />
            <small className="form-text text-muted">
                {identifiers.length == 0
                    ? 'No identifier parsed'
                    : identifiers.length + ' identifiers parsed'
                }
            </small>
        </React.Fragment>
    )
}
