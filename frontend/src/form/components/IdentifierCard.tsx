import React, { useCallback } from 'react'
import { Link } from "react-router-dom"
import { animated, useSpring } from 'react-spring'

import { Annotation, IdentifierList } from '../types'
import { useSelector, useActionCreator } from '../hooks'
import { actions } from '../reducers/identifiers'

import { AnnotationInput } from './AnnotationInput'

const example: Annotation = {
    source: 'GObp',
    ref: 'GO:0006914',
    name: 'GObp - GO:0006914 (autophagy)',
    accessions: [
        'P00519', 'Q5T8D3', 'Q9C0C7', 'P20073', 'P15289', 'P15848', 'Q9H0Y0', 'O94817', 'Q6ZNE5', 'Q2TAZ0', 'Q96BY7', 'Q9NT62',
        'Q8WYN0', 'Q9Y4P1', 'Q96DT6', 'Q86TL0', 'Q9H1Y0', 'O95352', 'Q7Z3C6', 'Q14457', 'A8MW95', 'Q12981', 'Q12983', 'Q9H6K1',
        'Q96LT7', 'Q8N5K1', 'Q2KHT3', 'Q13286', 'P51397', 'Q8N682', 'O14681', 'Q9HCE0', 'Q9H8M9', 'Q9Y3I1', 'Q9Y3D6', 'Q5T0N5',
        'Q12778', 'Q8IVP5', 'Q9BWH2', 'O95166', 'Q9H0R8', 'P60520', 'P54257', 'Q9UBN7', 'Q16666', 'A1A4Y4', 'P16144', 'Q92622',
        'Q6UXG2', 'P11279', 'Q8IVB5', 'Q5S007', 'Q9H492', 'Q9GZQ8', 'A6NCE7', 'Q9BXW4', 'Q66K74', 'Q7KZI7', 'O95140', 'Q14596',
        'Q6VVB1', 'O15118', 'Q96CV9', 'O60260', 'Q99497', 'Q8NEB9', 'P42338', 'Q99570', 'Q9BXM7', 'Q13131', 'P54646', 'Q9Y2R2',
        'Q6IQ22', 'P62820', 'Q9H0U4', 'Q969Q5', 'Q9H082', 'P49795', 'Q96GF1', 'Q9H4P4', 'P05109', 'P06702', 'P58004', 'Q8IXJ6',
        'Q8TC71', 'Q13501', 'P78539', 'Q15831', 'Q8NEM7', 'Q9HA65', 'Q3MII6', 'Q92609', 'Q7Z6L1', 'O15040', 'P19484', 'O15321',
        'Q9BTX3', 'Q9BXS4', 'Q96NL1', 'Q9H0E2', 'Q9Y2L5', 'Q6PHR2', 'Q14694', 'Q92995', 'Q70CQ3', 'Q9P2Y5', 'Q96GC9', 'Q9UID3',
        'Q8IZQ1', 'Q9Y484', 'Q5MNZ6', 'Q5MNZ9', 'Q9Y4P8', 'P17861', 'Q9BRR0',
    ]
}

export const IdentifierCard: React.FC = () => {
    const add = useActionCreator(actions.add)
    const select = useActionCreator(actions.select)

    const setExample = useCallback(() => { select(example) }, [select])

    return (
        <div className="card">
            <div className="card-body">
                <div className="alert alert-primary">
                    Many lists of uniprot accession number or uniprot name can be used to filter human proteins.
                    {' '}Predefined <Link to="#" onClick={setExample}>annotations</Link> are available.
                </div>
                <AnnotationInput select={select} />
                <hr />
                <IdentifierListFormGroupCollection />
                <button type="button" className="btn btn-info btn-block" onClick={add}>
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
