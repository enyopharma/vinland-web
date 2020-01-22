import React from 'react'

import { Taxon } from 'search/state/taxon'

type Props = {
    parent: Taxon | null
    children: Taxon[]
    select: (taxon: Taxon) => void
}

export const RelatedFormRow: React.FC<Props> = ({ parent, children, select }) => {
    const handleSelect = (value: string) => {
        if (value === '') return;
        select(children[parseInt(value)])
    }

    const handleParent = () => {
        if (parent === null) return
        select(parent)
    }

    return (
        <div className="form-row">
            <div className="col">
                <select
                    value=""
                    className="form-control"
                    onChange={e => handleSelect(e.target.value)}
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
                    onClick={() => handleParent()}
                >
                    Parent
                </button>
            </div>
        </div>
    )
}
