import React, { createRef, useState, useEffect } from 'react'

type Props = {

}

export const AnnotationSearchField: React.FC<Props> = () => {
    const ref = createRef<HTMLInputElement>()

    const [source, setSource] = useState('')

    useEffect(() => {
        if (source.length > 0) ref.current.focus()
    }, [source])

    return (
        <div style={{ position: 'relative' }}>
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        @
                </span>
                </div>
                <select
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    className="form-control form-control-lg col-2"
                >
                    <option value=""></option>
                    <option value="gene-ontology">Gene ontology</option>
                </select>
                <input
                    ref={ref}
                    type="text"
                    className="form-control form-control-lg"
                    disabled={source == ''}
                />
            </div>
        </div>
    )
}
