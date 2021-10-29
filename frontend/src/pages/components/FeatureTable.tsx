import React, { useState } from 'react'

import { Isoform, Feature } from '../types'

import { MappingImg } from './MappingImg'

type FeatureTableProps = {
    isoform: Isoform
    features: Feature[]
}

export const FeatureTable: React.FC<FeatureTableProps> = ({ isoform, features }) => {
    const types = typesf(features)

    const init = types.includes('domain') ? ['domain'] : []

    const [selected, setSelected] = useState<string[]>(init)

    const filtered = features.filter(filterf(selected)).sort(sortf)

    const list = (
        <div className="row">
            <div className="col">
                <TypeButtonList types={types} selected={selected} update={setSelected} />
            </div>
        </div>
    )

    if (selected.length === 0) {
        return (
            <React.Fragment>
                {list}
                <p className="text-center">
                    No feature type selected
                </p>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {list}
            <table className="table" style={{ lineHeight: '30px' }}>
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '8%' }}>-</th>
                        <th className="text-center" style={{ width: '20%' }}>Type</th>
                        <th className="text-center" style={{ width: '32%' }}>Description</th>
                        <th className="text-center" style={{ width: '40%' }}>Mapping</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((feature, i) => <InteractionTr key={i} isoform={isoform} feature={feature} />)}
                </tbody>
            </table>
        </React.Fragment>
    )
}

type TypeButtonListProps = {
    types: string[]
    selected: string[]
    update: (selected: string[]) => void
}

const TypeButtonList: React.FC<TypeButtonListProps> = ({ types, selected, update }) => (
    <div className="row">
        <div className="col">
            {types.map((type, i) => <TypeButton key={i} type={type} selected={selected} update={update} />)}
        </div>
    </div>
)

type TypeButtonProps = {
    type: string
    selected: string[]
    update: (selected: string[]) => void
}

const TypeButton: React.FC<TypeButtonProps> = ({ type, selected, update }) => {
    const classes = selected.includes(type)
        ? 'm-1 btn btn-sm btn-warning'
        : 'm-1 btn btn-sm btn-outline-warning'

    const types = selected.includes(type)
        ? selected.filter(t => t !== type)
        : [...selected, type]

    return (
        <button className={classes} onClick={() => update(types)}>
            {type}
        </button>
    )
}

type InteractionTrProps = {
    isoform: Isoform
    feature: Feature
}

const InteractionTr: React.FC<InteractionTrProps> = ({ isoform, feature }) => {
    const width = isoform.sequence.length

    return (
        <tr key={0}>
            <td className="text-center">
                -
            </td>
            <td className="text-center ellipsis">
                <span title={feature.type}>{feature.type}</span>
            </td>
            <td className="text-center ellipsis">
                <span title={feature.description}>{feature.description}</span>
            </td>
            <td>
                <MappingImg type="f" width={width} mappables={[feature]} />
            </td>
        </tr>
    )
}

const typesf = (features: Feature[]) => {
    const seen: Record<string, number> = {}

    features.forEach(f => seen[f.type]++)

    const types = Object.keys(seen)

    return types.sort(a => a === 'domain' ? -1 : 1)
}

const filterf = (selected: string[]) => (feature: Feature) => {
    return selected.filter(t => t === feature.type).length > 0
}

const sortf = (a: Feature, b: Feature) => {
    const lengtha = a.stop - a.start + 1
    const lengthb = b.stop - b.start + 1

    return a.start - b.start || lengtha - lengthb
}
