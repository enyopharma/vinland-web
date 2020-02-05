import React, { useCallback } from 'react'
import { useSelector, useActionCreator } from 'search/state'

import { Name } from 'search/features/taxonomy'
import { creators } from 'search/features/taxonomy'

type Props = {
    names: Name[]
}

export const NameList: React.FC<Props> = ({ names }) => {
    const selected = useSelector(search => search.taxonomy.names)
    const update = useActionCreator(creators.update)

    const classes = useCallback((name: Name) => {
        return selected.includes(name)
            ? 'm-1 btn btn-sm btn-danger'
            : 'm-1 btn btn-sm btn-outline-danger'
    }, [selected])

    const toggle = useCallback((name: Name) => {
        const names = selected.includes(name)
            ? selected.filter(n => n !== name)
            : [...selected, name]

        return update(names)
    }, [selected, update])

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
