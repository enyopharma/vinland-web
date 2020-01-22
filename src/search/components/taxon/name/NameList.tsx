import React from 'react'

import { Name } from 'search/state/name'

type Props = {
    names: Name[]
    selected: Name[]
    update: (names: Name[]) => void
}

export const NameList: React.FC<Props> = ({ names, selected, update }) => {
    const classes = (name: Name) => selected.includes(name)
        ? 'm-1 btn btn-sm btn-danger'
        : 'm-1 btn btn-sm btn-outline-danger'

    const select = (name: Name) => (e: any) => {
        e.preventDefault();
        selected.includes(name)
            ? update(selected.filter(n => n !== name))
            : update([...selected, name])
    }

    return (
        <p>
            {names.length === 0
                ? 'no interactor associated to this taxon'
                : names.map((name, i) => (
                    <button key={i} className={classes(name)} onClick={select(name)}>
                        {name}
                    </button>
                ))}
        </p>
    )
}
