import React from 'react'

import { useActionCreator } from 'app/hooks'

import { Name } from '../types'
import { actions } from '../reducer'

type NameListProps = {
    names: Name[]
    selected: Name[]
}

export const NameList: React.FC<NameListProps> = ({ names, selected }) => {
    const update = useActionCreator(actions.update)

    const buttons = names.length === 0
        ? 'no interactor associated to this taxon'
        : names.map((name, i) => <NameButton key={i} name={name} selected={selected} update={update} />)

    return <p>{buttons}</p>
}

type NameButtonProps = {
    name: Name
    selected: Name[]
    update: (names: Name[]) => void
}

const NameButton: React.FC<NameButtonProps> = ({ name, selected, update }) => {
    const classes = selected.includes(name)
        ? 'm-1 btn btn-sm btn-danger'
        : 'm-1 btn btn-sm btn-outline-danger'

    const names = selected.includes(name)
        ? selected.filter(n => n !== name)
        : [...selected, name]

    return (
        <button className={classes} onClick={e => update(names)}>
            {name}
        </button>
    )
}
