import React, { useMemo } from 'react'
import { animated, useSpring } from 'react-spring'

import { useActionCreator } from 'app/hooks'

import { parse } from '../utils'
import { actions } from '../reducer'
import { IdentifierList } from '../types'

import { AnnotationInput } from './AnnotationInput'
import { IdentifierListFormGroup } from './IdentifierListFormGroup'

type Props = {
    lists: IdentifierList[]
}

export const IdentifierCard: React.FC<Props> = ({ lists }) => {
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

const FadeIn: React.FC<{ enabled: boolean }> = ({ enabled, children }) => {
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
