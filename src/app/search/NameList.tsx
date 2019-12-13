import React, { useState, useEffect } from 'react'

import { Name } from './src/name'

type Props = {
    names: Name[]
    update: (names: Name[]) => void
}

export const NameList: React.FC<Props> = ({ names, update }) => {
    const [selected, setSelected] = useState<Name[]>(names)

    useEffect(() => { update(selected) }, [update, selected])

    const classes = (name: Name) => selected.includes(name)
        ? 'btn btn-sm btn-danger'
        : 'btn btn-sm btn-outline-danger'

    const select = (name: Name) => (e: any) => {
        e.preventDefault();
        selected.includes(name)
            ? setSelected(selected.filter(n => n !== name))
            : setSelected([...selected, name])
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
