import React from 'react'

import { useActionCreator } from 'app/hooks'

import { Taxon } from '../types'
import { actions } from '../reducer'

type Props = {
    parent: Taxon | null
    children: Taxon[]
}

export const RelatedFormRow: React.FC<Props> = ({ parent, children }) => {
    const select = useActionCreator(actions.select)

    const selectParent = () => parent && select(parent)

    const selectChild = (value: string) => value !== '' && select(children[parseInt(value)])

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
