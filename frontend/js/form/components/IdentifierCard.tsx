import React from 'react'

import { IdentifierList } from 'form/types'

import { IdentifierListField } from './IdentifierListField'

type Props = {
    lists: IdentifierList[]
    add: () => void
    select: (i: number, list: IdentifierList) => void
    update: (i: number, identifiers: string) => void
    remove: (i: number) => void
    parsed: string[]
}

export const IdentifierCard: React.FC<Props> = ({ lists, parsed, ...actions }) => {
    const onClick = () => actions.add()

    return (
        <div className="card">
            <div className="card-body">
                {
                    lists.map((list, i) => (
                        <IdentifierListField
                            key={list.key}
                            list={list}
                            update={(identifiers: string) => actions.update(i, identifiers)}
                            select={(list: IdentifierList) => actions.select(i, list)}
                            remove={() => actions.remove(i)}
                        />
                    ))
                }
                <div className="row">
                    <div className="col">
                        <button
                            type="button"
                            className="btn btn-primary btn-block"
                            onClick={onClick}
                        >
                            Add a new identifier list
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                {parsed.length == 0
                    ? 'No identifier parsed'
                    : parsed.length + ' identifiers parsed'
                }
            </div>
        </div>
    )
}
