import React from 'react'

import { Mapping } from '../types'

type MappingImgProps = {
    type: 'h' | 'v'
    width: number
    mappings: Mapping[]
}

export const MappingImg: React.FC<MappingImgProps> = ({ type, width, mappings }) => (
    <svg width="100%" height="30">
        <rect width="100%" y="14" height="2" style={{ fill: '#eee', strokeWidth: 0 }} />
        {mappings.map((mapping, i) => <MappingRect key={i} type={type} width={width} mapping={mapping} />)}
    </svg>
)

type MappingRectProps = {
    type: 'h' | 'v'
    width: number
    mapping: Mapping
}

const MappingRect: React.FC<MappingRectProps> = ({ type, width, mapping }) => {
    const color = type === 'h' ? '#6CC3D5' : '#FF7851'
    const startp = ((mapping.start / width) * 100) + '%'
    const stopp = ((mapping.stop / width) * 100) + '%'
    const widthp = (((mapping.stop - mapping.start + 1) / width) * 100) + '%'

    return (
        <React.Fragment>
            <text x={startp} y="10" textAnchor="start" style={{ fontSize: '10px' }}>
                {mapping.start}
            </text>
            <text x={stopp} y="30" textAnchor="end" style={{ fontSize: '10px' }}>
                {mapping.stop}
            </text>
            <rect width={widthp} x={startp} y="13" height="4" style={{ fill: color, strokeWidth: 0 }} />
        </React.Fragment>
    )
}
