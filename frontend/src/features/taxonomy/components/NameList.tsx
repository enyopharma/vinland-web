import React from 'react'

import { useActionCreator } from 'app/hooks'

import { Name } from '../types'
import { actions } from '../reducer'

type Props = {
    names: Name[]
    selected: Name[]
}

export const NameList: React.FC<Props> = ({ names, selected }) => {
    const update = useActionCreator(actions.update)

    const buttons = names.length === 0
        ? 'no interactor associated to this taxon'
        : names.map((name, i) => <Button key={i} name={name} selected={selected} update={update} />)

    return <p>{buttons}</p>
}

type ButtonProps = {
    name: Name
    selected: Name[]
    update: (names: Name[]) => void
}

const Button: React.FC<ButtonProps> = ({ name, selected, update }) => {
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
