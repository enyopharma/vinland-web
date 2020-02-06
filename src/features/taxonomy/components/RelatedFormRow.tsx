import React, { useCallback } from 'react'
import { useActionCreator } from 'app'

import { Taxon } from 'features/taxonomy'
import { actions } from 'features/taxonomy'

type Props = {
    parent: Taxon | null
    children: Taxon[]
}

export const RelatedFormRow: React.FC<Props> = ({ parent, children }) => {
    const select = useActionCreator(actions.select)

    const selectParent = useCallback(() => {
        if (parent === null) return;
        select(parent)
    }, [select, parent])

    const selectChild = useCallback((value: string) => {
        if (value === '') return;
        select(children[parseInt(value)])
    }, [select, children])

    return (
        <div className="form-row">
            <div className="col">
                <select
                    value=""
                    className="form-control"
                    onChange={e => selectChild(e.target.value)}
                >
                    <option value="" disabled>Sub-taxa</option>
                    {children.map((taxon, i) => (
                        <option key={i} value={i}>{taxon.name}</option>
                    ))}
                </select>
            </div>
            <div className="col-2">
                <button
                    className="btn btn-block btn-danger"
                    title={parent === null ? undefined : parent.name}
                    disabled={parent === null}
                    onClick={e => selectParent()}
                >
                    Parent
                </button>
            </div>
        </div>
    )
}
