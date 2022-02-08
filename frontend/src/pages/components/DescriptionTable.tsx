import React from 'react'

import { clusters } from '../utils'
import { Isoform, Description } from '../types'

import { MappingImg } from './MappingImg'

type DescriptionTableProps = {
    type1: 'h' | 'v'
    type2: 'h' | 'v'
    isoform1: Isoform
    isoform2: Isoform
    descriptions: Description[]
}

export const DescriptionTable: React.FC<DescriptionTableProps> = ({ descriptions, ...props }) => (
    <table className="table" style={{ lineHeight: '30px' }}>
        <thead>
            <tr>
                <th className="text-center">Publication</th>
                <th className="text-center" style={{ width: '24%' }}>Method</th>
                <th className="text-center" style={{ width: '32%' }}>Mapping 1</th>
                <th className="text-center" style={{ width: '32%' }}>Mapping 2</th>
            </tr>
        </thead>
        <tbody>
            {descriptions.sort(sortd).map((description, i) => <DescriptionTr key={i} {...props} description={description} />)}
        </tbody>
    </table>
)

type DescriptionTrProps = {
    type1: 'h' | 'v'
    type2: 'h' | 'v'
    isoform1: Isoform
    isoform2: Isoform
    description: Description
}

const DescriptionTr: React.FC<DescriptionTrProps> = ({ type1, type2, isoform1, isoform2, description }) => {
    const width1 = isoform1.sequence.length
    const width2 = isoform2.sequence.length
    const mappings1 = description.mappings.filter(m => isoform1.id === m.sequence_id)
    const mappings2 = description.mappings.filter(m => isoform2.id === m.sequence_id)
    const clx1 = clusters(mappings1)
    const clx2 = clusters(mappings2)
    const maxclx = Math.max(clx1.length, clx2.length)
    const rowspan = maxclx > 1 ? maxclx : undefined

    const url = `https://pubmed.ncbi.nlm.nih.gov/${description.publication.pmid}/`

    const title = description.publication.year && description.publication.title
        ? `${description.publication.year} - ${description.publication.title}`
        : ''

    return (
        <React.Fragment>
            <tr key={0}>
                <td className="text-center" rowSpan={rowspan}>
                    <a href={url} title={title} target="_blank" rel="noreferrer">
                        {description.publication.pmid}
                    </a>
                </td>
                <td className="text-center ellipsis" rowSpan={rowspan}>
                    <span title={`${description.method.psimi_id}: ${description.method.name}`}>
                        {description.method.psimi_id}: {description.method.name}
                    </span>
                </td>
                <td className="text-center">
                    {clx1.length === 0 ? '-' : <MappingImg type={type1} width={width1} mappables={clx1[0]} />}
                </td>
                <td className="text-center">
                    {clx2.length === 0 ? '-' : <MappingImg type={type2} width={width2} mappables={clx2[0]} />}
                </td>
            </tr>
            {maxclx > 0 && [...Array(maxclx - 1)].map((_, i) => (
                <tr key={i + 1}>
                    <td className="text-center">
                        {clx1[i + 1] && <MappingImg type={type1} width={width1} mappables={clx1[i + 1]} />}
                    </td>
                    <td className="text-center">
                        {clx2[i + 1] && <MappingImg type={type2} width={width2} mappables={clx2[i + 1]} />}
                    </td>
                </tr>
            ))}
        </React.Fragment>
    )
}

const sortd = (a: Description, b: Description) => b.mappings.length - a.mappings.length
