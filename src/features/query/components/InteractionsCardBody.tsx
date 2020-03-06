import React from 'react'

import { ComputationCache, Interaction } from 'features/query'
import { useInteractionsContext } from 'features/query'
import { config, interactions2csv } from 'features/query'

import { Pagination } from './Pagination'
import { CsvDownloadButton } from './CsvDownloadButton'

type Props = {
    result: ComputationCache
}

export const InteractionsCardBody: React.FC<Props> = ({ result }) => {
    const interactions = result.interactions

    const { offset, setOffset } = useInteractionsContext()

    const slice = interactions.slice(offset, offset + config.limit)

    return (
        <React.Fragment>
            <div className="card-body">
                <p className="text-right">
                    <CsvDownloadButton csv={() => interactions2csv(interactions)}>
                        Download as csv
                    </CsvDownloadButton>
                </p>
                <Pagination offset={offset} total={interactions.length} update={setOffset} />
            </div>
            <table className="table card-table table-stripped table-hover">
                <thead>
                    <tr>
                        <th className="col-1 text-center" colSpan={1}>-</th>
                        <th className="col-2 text-center" colSpan={2}>Protein 1</th>
                        <th className="col-2 text-center" colSpan={2}>Protein 2</th>
                        <th className="col-8 text-center" colSpan={1}>Taxon</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(config.limit)].map((_, i) => slice[i]
                        ? <InteractionTr key={i} interaction={slice[i]} />
                        : <SkeletonTr key={i} />
                    )}
                </tbody>
            </table>
            <div className="card-body">
                <Pagination offset={offset} total={interactions.length} update={setOffset} />
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

const InteractionTr: React.FC<{ interaction: Interaction }> = ({ interaction }) => (
    <tr>
        <td className="text-center">
            <a href="/" style={{ textDecoration: 'none' }}>
                <img
                    src={`/img/${interaction.type}.png`}
                    alt={`${interaction.type.toUpperCase()} interaction`}
                    style={{ maxWidth: '1em' }}
                />
            </a>
        </td>
        <td className="text-center">
            <a href="/" className="text-info">
                {interaction.protein1.accession}
            </a>
        </td>
        <td className="text-center">
            {interaction.protein1.name}
        </td>
        <td className="text-center">
            <a href="/" className={interaction.protein2.type === 'h' ? 'text-info' : 'text-danger'}>
                {interaction.protein2.accession}
            </a>
        </td>
        <td className="text-center">
            {interaction.protein2.name}
        </td>
        <td className="text-center" style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '10px',
        }}>
            <span title={interaction.protein2.taxon.name}>
                {interaction.protein2.taxon.name}
            </span>
        </td>
    </tr>
)
