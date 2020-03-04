import React from 'react'

import { IdentifierList } from 'features/identifiers'

type Props = {
    list: IdentifierList
    update: (identifiers: string) => void
    remove: () => void
}

export const IdentifierListFormGroup: React.FC<Props> = ({ list, update, remove }) => {
    return (
        <div className="form-group">
            <label>{list.name}</label>
            <div className="input-group">
                <textarea
                    className="form-control"
                    placeholder="Uniprot accession numbers or names spaced by commas or new lines."
                    value={list.identifiers}
                    onChange={e => update(e.target.value)}
                />
                <div className="input-group-append">
                    <button type="button" className="btn btn-danger" onClick={remove}>
                        X
                    </button>
                </div>
            </div>
        </div>
    )
}
