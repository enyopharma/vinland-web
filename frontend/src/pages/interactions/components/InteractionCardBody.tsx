import React from 'react'

import { Pagination, ProteinLink, InteractionLink } from 'app/partials'

import { Interaction } from '../types'
import { CsvDownloadButton } from './CsvDownloadButton'

const limit = 10

type Props = {
    interactions: Interaction[]
    offset: number
    setOffset: (offset: number) => void
}

export const InteractionCardBody: React.FC<Props> = ({ interactions, offset, setOffset }) => {
    const slice = interactions.slice(offset, offset + limit)

    return (
        <React.Fragment>
            <div className="card-body">
                <p className="text-right">
                    <CsvDownloadButton csv={() => interactions2csv(interactions)}>
                        Download as csv
                    </CsvDownloadButton>
                </p>
            </div>
            <div className="card-body">
                <Pagination offset={offset} total={interactions.length} limit={limit} update={setOffset} />
            </div>
            <table className="table card-table table-stripped table-hover">
                <thead>
                    <tr>
                        <th className="col-1 text-center" colSpan={1}>-</th>
                        <th className="col-3 text-center" colSpan={2}>Protein 1</th>
                        <th className="col-3 text-center" colSpan={2}>Protein 2</th>
                        <th className="col-5 text-center" colSpan={1}>Taxon</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(limit)].map((_, i) => slice[i]
                        ? <InteractionTr key={i} interaction={slice[i]} />
                        : <SkeletonTr key={i} />
                    )}
                </tbody>
            </table>
            <div className="card-body">
                <Pagination offset={offset} total={interactions.length} limit={limit} update={setOffset} />
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
        <td className="text-center">-</td>
        <td className="text-center">-</td>
    </tr>
)

type InteractionTrProps = {
    interaction: Interaction
}

const InteractionTr: React.FC<InteractionTrProps> = ({ interaction }) => (
    <tr>
        <td className="text-center">
            <InteractionLink {...interaction} target="_blank">
                <img
                    src={`/img/${interaction.type}.png`}
                    alt={`${interaction.type.toUpperCase()} interaction`}
                    style={{ maxWidth: '1em' }}
                />
            </InteractionLink>
        </td>
        <td className="text-center">
            <ProteinLink {...interaction.protein1} target="_blank">
                <span className={interaction.protein1.type === 'h' ? 'text-info' : 'text-danger'}>
                    {interaction.protein1.accession}
                </span>
            </ProteinLink>
        </td>
        <td className="text-center">
            {interaction.protein1.name}
        </td>
        <td className="text-center">
            <ProteinLink {...interaction.protein2} target="_blank">
                <span className={interaction.protein2.type === 'h' ? 'text-info' : 'text-danger'}>
                    {interaction.protein2.accession}
                </span>
            </ProteinLink>
        </td>
        <td className="text-center">
            {interaction.protein2.name}
        </td>
        <td className="text-center ellipsis">
            <span title={interaction.protein2.taxon.name}>
                {interaction.protein2.taxon.name}
            </span>
        </td>
    </tr>
)

const interactions2csv = (interactions: Interaction[], sep: string = "\t") => {
    const headers = ['type', 'accession1', 'name1', 'taxon1', 'accession2', 'name2', 'taxon2']

    const fields = (i: Interaction) => [
        i.type,
        i.protein1.accession, i.protein1.name, i.protein1.taxon.name,
        i.protein2.accession, i.protein2.name, i.protein2.taxon.name,
    ]

    return `#${headers.join(sep)}\n${interactions.map(i => fields(i).join(sep)).join("\n")}`
}
