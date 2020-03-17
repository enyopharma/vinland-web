import React from 'react'

import { useActionCreator } from 'app'

import { Name } from 'features/taxonomy'
import { actions } from 'features/taxonomy'

type Props = {
    names: Name[]
    selected: Name[]
}

export const NameList: React.FC<Props> = ({ names, selected }) => {
    const update = useActionCreator(actions.update)

    const classes = (name: Name) => selected.includes(name)
        ? 'm-1 btn btn-sm btn-danger'
        : 'm-1 btn btn-sm btn-outline-danger'

    const toggle = (name: Name) => {
        const names = selected.includes(name)
            ? selected.filter(n => n !== name)
            : [...selected, name]

        return update(names)
    }

    return (
        <p>
            {names.length === 0
                ? 'no interactor associated to this taxon'
                : names.map((name, i) => (
                    <button key={i} className={classes(name)} onClick={e => toggle(name)}>
                        {name}
                    </button>
                ))}
        </p>
    )
}
