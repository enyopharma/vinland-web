import React from 'react'

import { Name } from 'search/state/virus'

type Props = {
    names: Name[]
    selected: Name[]
    update: (names: Name[]) => void
}

export const NameList: React.FC<Props> = ({ names, selected, update }) => {
    const classes = (name: Name) => selected.includes(name)
        ? 'btn btn-sm btn-danger'
        : 'btn btn-sm btn-outline-danger'

    const select = (name: Name) => (e: any) => {
        e.preventDefault();
        selected.includes(name)
            ? update(selected.filter(n => n !== name))
            : update([...selected, name])
    }

    return (
        <ul className="list-inline">
            {names.map((name, i) => (
                <li key={i} className="list-inline-item">
                    <a href="/" className={classes(name)} onClick={select(name)}>
                        {name}
                    </a>
                </li>
            ))}
        </ul>
    )
}
