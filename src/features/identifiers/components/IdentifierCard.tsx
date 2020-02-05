import React, { useMemo } from 'react'
import { useSpring, animated } from 'react-spring'
import { useActionCreator } from 'app'

import { IdentifierList } from 'features/identifiers'
import { creators, parse } from 'features/identifiers'

import { AnnotationInput } from './AnnotationInput'
import { IdentifierListFormGroup } from './IdentifierListFormGroup'

type Props = {
    lists: IdentifierList[]
}

type AnimatedProps = {
    enabled: boolean
    list: IdentifierList
    update: (identifiers: string) => void
    remove: () => void
}

export const IdentifierCard: React.FC<Props> = ({ lists }) => {
    const add = useActionCreator(creators.add)
    const select = useActionCreator(creators.select)
    const update = useActionCreator(creators.update)
    const remove = useActionCreator(creators.remove)

    const parsed = useMemo(() => parse(lists).length, [lists])

    return (
        <div className="card">
            <div className="card-body">
                <AnnotationInput select={select} />
                <hr />
                {lists.map((list, i) => (
                    <AnimatedIdentifierListFormGroup
                        key={list.i}
                        enabled={i > 0}
                        list={list}
                        update={(identifiers: string) => update(i, identifiers)}
                        remove={() => remove(i)}
                    />
                ))}
                <button type="button" className="btn btn-primary btn-block" onClick={e => add()}>
                    Add a new identifier list
                </button>
            </div>
            <div className="card-footer">
                {parsed === 0 ? 'No identifier parsed' : parsed + ' identifiers parsed'}
            </div>
        </div>
    )
}

const AnimatedIdentifierListFormGroup: React.FC<AnimatedProps> = ({ enabled, ...props }) => {
    const style = useSpring({
        config: { duration: 500 },
        from: { opacity: 0 },
        to: { opacity: 1 },
    })

    return (
        <animated.div className="animation" style={enabled ? style : {}}>
            <IdentifierListFormGroup {...props} />
        </animated.div>
    )
}
