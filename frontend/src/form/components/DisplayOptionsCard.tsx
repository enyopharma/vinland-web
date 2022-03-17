import React from 'react'

import { actions } from '../reducers/options'
import { useSelector, useActionCreator } from '../hooks'

export const DisplayOptionsCard: React.FC = () => (
    <div className="card">
        <div className="card-body">
            <div className="row mb-4">
                <div className="col">
                    <div className="form-check form-check-inline">
                        <HHCheckbox id="hh" />
                        <label className="form-check-label" htmlFor="hh">
                            Show HH ppi
                        </label>
                    </div>
                </div>
                <div className="col">
                    <div className="form-check form-check-inline">
                        <VHCheckbox id="vh" />
                        <label className="form-check-label" htmlFor="vh">
                            Show VH ppi
                        </label>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-check form-check-inline">
                        <NeighborsCheckbox id="neighbors" />
                        <label className="form-check-label" htmlFor="neighbors">
                            Include human neighbors
                        </label>
                    </div>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <div className="form-check form-check-inline">
                        <IsGoldCheckbox id="is_gold" />
                        <label className="form-check-label" htmlFor="is_gold">
                            Gold interactions (&gt; 1 publication or &gt; 1 detection method)
                        </label>
                    </div>
                </div>
                <div className="col">
                    <div className="form-check form-check-inline">
                        <IsBinaryCheckbox id="is_binary" />
                        <label className="form-check-label" htmlFor="is_binary">
                            Binary interactions (at least one binary detection method)
                        </label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <PublicationsLabel id="publications" />
                    <PublicationsRange id="publications" />
                </div>
                <div className="col">
                    <MethodsLabel id="methods" />
                    <MethodsRange id="methods" />
                </div>
            </div>
        </div>
    </div>
)

type HHCheckboxProps = {
    id: string
}

const HHCheckbox: React.FC<HHCheckboxProps> = ({ id }) => {
    const checked = useSelector(state => state.options.hh)
    const update = useActionCreator(actions.setHH)

    return (
        <input
            id={id}
            type="checkbox"
            className="form-check-input"
            checked={checked}
            onChange={e => update(e.target.checked)}
        />
    )
}

type VHCheckboxProps = {
    id: string
}

const VHCheckbox: React.FC<VHCheckboxProps> = ({ id }) => {
    const checked = useSelector(state => state.options.vh)
    const update = useActionCreator(actions.setVH)

    return (
        <input
            id={id}
            type="checkbox"
            className="form-check-input"
            checked={checked}
            onChange={e => update(e.target.checked)}
        />
    )
}

type NeighborsCheckboxProps = {
    id: string
}

const NeighborsCheckbox: React.FC<NeighborsCheckboxProps> = ({ id }) => {
    const checked = useSelector(state => state.options.neighbors)
    const disabled = useSelector(state => !state.options.hh)
    const update = useActionCreator(actions.setNeighbors)

    return (
        <input
            id={id}
            type="checkbox"
            className="form-check-input"
            checked={checked}
            disabled={disabled}
            onChange={e => update(e.target.checked)}
        />
    )
}

type IsGoldCheckboxProps = {
    id: string
}

const IsGoldCheckbox: React.FC<IsGoldCheckboxProps> = ({ id }) => {
    const checked = useSelector(state => state.options.is_gold)
    const update = useActionCreator(actions.setIsGold)

    return (
        <input
            id={id}
            type="checkbox"
            className="form-check-input"
            checked={checked}
            onChange={e => update(e.target.checked)}
        />
    )
}

type IsBinaryCheckboxProps = {
    id: string
}

const IsBinaryCheckbox: React.FC<IsBinaryCheckboxProps> = ({ id }) => {
    const checked = useSelector(state => state.options.is_binary)
    const update = useActionCreator(actions.setIsBinary)

    return (
        <input
            id={id}
            type="checkbox"
            className="form-check-input"
            checked={checked}
            onChange={e => update(e.target.checked)}
        />
    )
}

type PublicationsLabelProps = {
    id: string
}

const PublicationsLabel: React.FC<PublicationsLabelProps> = ({ id }) => {
    const publications = useSelector(state => state.options.publications)

    const message = publications === 0
        ? 'At least 1 publication describing PPIs'
        : `At least ${publications} publications describing PPIs`

    return <label htmlFor={id}>{message}</label>
}

type PublicationsRangeProps = {
    id: string
    min?: number
    max?: number
}

const PublicationsRange: React.FC<PublicationsRangeProps> = ({ id, min = 1, max = 10 }) => {
    const value = useSelector(state => state.options.publications)
    const update = useActionCreator(actions.setPublications)

    return (
        <input
            id={id}
            type="range"
            className="custom-range"
            value={value}
            min={min}
            max={max}
            onChange={e => update(parseInt(e.target.value))}
        />
    )
}

type MethodsLabelProps = {
    id: string
}

const MethodsLabel: React.FC<MethodsLabelProps> = ({ id }) => {
    const methods = useSelector(state => state.options.methods)

    const message = methods === 0
        ? 'At least 1 method describing PPIs'
        : `At least ${methods} methods describing PPIs`

    return <label htmlFor={id}>{message}</label>
}

type MethodsRangeProps = {
    id: string
    min?: number
    max?: number
}

const MethodsRange: React.FC<MethodsRangeProps> = ({ id, min = 1, max = 10 }) => {
    const value = useSelector(state => state.options.methods)
    const update = useActionCreator(actions.setMethods)

    return (
        <input
            id={id}
            type="range"
            className="custom-range"
            value={value}
            min={min}
            max={max}
            onChange={e => update(parseInt(e.target.value))}
        />
    )
}
