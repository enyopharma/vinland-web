import React from 'react'

import { Isoform, Description, Mapping } from '../types'

import { MappingImg } from './MappingImg'

type DescriptionTableProps = {
    type1: 'h' | 'v'
    type2: 'h' | 'v'
    isoform1: Isoform
    isoform2: Isoform
    descriptions: Description[]
}

export const DescriptionTable: React.FC<DescriptionTableProps> = ({ descriptions, ...props }) => (
    <table className="table">
        <thead>
            <tr>
                <th className="col-2 text-center">pmid</th>
                <th className="col-2 text-center">psimi id</th>
                <th className="col-4 text-center">Mapping 1</th>
                <th className="col-4 text-center">Mapping 2</th>
            </tr>
        </thead>
        <tbody>
            {descriptions.sort(sortd).map((description, i) => <DescriptionTr key={i} {...props} description={description} />)}
        </tbody>
    </table>
)

type DescriptionTr = {
    type1: 'h' | 'v'
    type2: 'h' | 'v'
    isoform1: Isoform
    isoform2: Isoform
    description: Description
}

const DescriptionTr: React.FC<DescriptionTr> = ({ type1, type2, isoform1, isoform2, description }) => {
    const width1 = isoform1.sequence.length
    const width2 = isoform2.sequence.length
    const mappings1 = description.mappings.filter(m => isoform1.id === m.sequence_id).sort((a: Mapping, b: Mapping) => a.start - b.start)
    const mappings2 = description.mappings.filter(m => isoform2.id === m.sequence_id).sort((a: Mapping, b: Mapping) => a.start - b.start)

    return (
        <React.Fragment>
            <tr key={0}>
                <td className="text-center">
                    <span title={`${description.publication.year} - ${description.publication.title}`}>
                        {description.publication.pmid}
                    </span>
                </td>
                <td className="text-center">
                    <span title={description.method.name}>
                        {description.method.psimi_id}
                    </span>
                </td>
                <td className="text-center">
                    {mappings1.length === 0 ? '-' : <MappingImg type={type1} width={width1} mappings={mappings1} />}
                </td>
                <td className="text-center">
                    {mappings2.length === 0 ? '-' : <MappingImg type={type2} width={width2} mappings={mappings2} />}
                </td>
            </tr>
        </React.Fragment>
    )
}

const sortd = (a: Description, b: Description) => b.mappings.length - a.mappings.length
