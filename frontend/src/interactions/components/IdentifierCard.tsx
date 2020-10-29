import React, { useMemo } from 'react'
import { animated, useSpring } from 'react-spring'

import { useActionCreator } from 'app/hooks'

import { parse } from '../utils'
import { IdentifierList } from '../types'
import { actions } from '../reducers/identifiers'

import { AnnotationInput } from './AnnotationInput'

type IdentifierCardProps = {
    lists: IdentifierList[]
}

export const IdentifierCard: React.FC<IdentifierCardProps> = ({ lists }) => {
    const add = useActionCreator(actions.add)
    const select = useActionCreator(actions.select)
    const update = useActionCreator(actions.update)
    const remove = useActionCreator(actions.remove)

    const parsed = useMemo(() => parse(lists).length, [lists])

    return (
        <div className="card">
            <div className="card-body">
                <AnnotationInput select={select} />
                <hr />
                {lists.map((list, i) => (
                    <FadeIn key={list.i} enabled={list.i > 0}>
                        <IdentifierListFormGroup
                            key={list.i}
                            list={list}
                            update={(identifiers: string) => update(i, identifiers)}
                            remove={() => remove(i)}
                        />
                    </FadeIn>
                ))}
                <button type="button" className="btn btn-primary btn-block" onClick={add}>
                    Add a new identifier list
                </button>
            </div>
            <div className="card-footer">
                {parsed === 0 ? 'No identifier parsed' : parsed + ' identifiers parsed'}
            </div>
        </div>
    )
}

type FadeInProps = {
    enabled: boolean
}

const FadeIn: React.FC<FadeInProps> = ({ enabled, children }) => {
    const style = useSpring({
        config: { duration: 500 },
        from: { opacity: 0 },
        to: { opacity: 1 },
    })

    return (
        <animated.div className="animation" style={enabled ? style : {}}>
            {children}
        </animated.div>
    )
}

type IdentifierListFormGroupProps = {
    list: IdentifierList
    update: (identifiers: string) => void
    remove: () => void
}

const IdentifierListFormGroup: React.FC<IdentifierListFormGroupProps> = ({ list, update, remove }) => {
    return (
        <div className="form-group">
            <label>{list.name}</label>
            <div className="input-group">
                <textarea
                    className="form-control"
                    placeholder="Uniprot accession numbers or names spaced by commas or new lines."
                    value={list.identifiers}
                    onChange={e => update(e.target.value)}
                />
                <div className="input-group-append">
                    <button type="button" className="btn btn-danger" onClick={remove}>
                        X
                    </button>
                </div>
            </div>
        </div>
    )
}
