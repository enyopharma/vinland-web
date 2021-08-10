import React, { useState } from 'react'

import { Pagination } from 'partials'

import { Isoform, Feature } from '../types'

import { MappingImg } from './MappingImg'

const limit = 10

type FeatureTableProps = {
    isoform: Isoform
    features: Feature[]
}

export const FeatureTable: React.FC<FeatureTableProps> = ({ isoform, features }) => {
    const [offset, setOffset] = useState<number>(0)

    const slice = features.sort(sorti).slice(offset, offset + limit)

    return (
        <React.Fragment>
            <div className="row">
                <div className="col">
                    <Pagination offset={offset} total={features.length} limit={limit} update={setOffset} />
                </div>
            </div>
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
                    {[...Array(limit)].map((_, i) => slice[i]
                        ? <InteractionTr key={i} isoform={isoform} feature={slice[i]} />
                        : <SkeletonTr key={i} />
                    )}
                </tbody>
            </table>
            <div className="row">
                <div className="col">
                    <Pagination offset={offset} total={features.length} limit={limit} update={setOffset} />
                </div>
            </div>
        </React.Fragment>
    )
}

const SkeletonTr: React.FC = () => (
    <tr>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
    </tr>
)

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

const sorti = (a: Feature, b: Feature) => {
    const lengtha = a.stop - a.start + 1
    const lengthb = b.stop - b.start + 1

    return a.start - b.start || lengtha - lengthb
}
