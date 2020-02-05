import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useSelector, useActionCreator } from 'search/state'

import { IdentifierList } from 'search/features/identifiers'
import { creators, parse } from 'search/features/identifiers'

import { AnnotationInput } from './AnnotationInput'
import { IdentifierListFormGroup } from './IdentifierListFormGroup'

type AnimatedProps = {
    enabled: boolean
    list: IdentifierList
    update: (identifiers: string) => void
    remove: () => void
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

export const IdentifierCard: React.FC = () => {
    const lists = useSelector(search => search.identifiers)
    const parsed = useSelector(search => parse(search.identifiers).length)
    const add = useActionCreator(creators.add)
    const select = useActionCreator(creators.select)
    const update = useActionCreator(creators.update)
    const remove = useActionCreator(creators.remove)

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
