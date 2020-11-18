import React from 'react'
import { animated, useSpring } from 'react-spring'

import { IdentifierList } from '../types'
import { useSelector, useActionCreator } from '../hooks'
import { actions } from '../reducers/identifiers'

import { AnnotationInput } from './AnnotationInput'

export const IdentifierCard: React.FC = () => {
    const add = useActionCreator(actions.add)
    const select = useActionCreator(actions.select)

    return (
        <div className="card">
            <div className="card-body">
                <AnnotationInput select={select} />
                <hr />
                <IdentifierListFormGroupCollection />
                <button type="button" className="btn btn-primary btn-block" onClick={add}>
                    Add a new identifier list
                </button>
            </div>
            <IdentifierCardFooter />
        </div>
    )
}

const IdentifierListFormGroupCollection: React.FC = () => {
    const lists = useSelector(state => state.identifiers.lists)
    const update = useActionCreator(actions.update)
    const remove = useActionCreator(actions.remove)

    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}

const IdentifierCardFooter: React.FC = () => {
    const nb = useSelector(state => state.identifiers.parsed.length)

    const message = nb === 0 ? 'No identifier parsed' : nb + ' identifiers parsed'

    return <div className="card-footer">{message}</div>
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

const IdentifierListFormGroup: React.FC<IdentifierListFormGroupProps> = ({ list, update, remove }) => (
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
