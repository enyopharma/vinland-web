import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Timeout } from 'app/partials'

import { resources } from '../api'
import { Protein, Isoform } from '../types'

const InteractionTable = React.lazy(() => import('./InteractionTable').then(module => ({ default: module.InteractionTable })))

export const ProteinPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    return (
        <div className="container">
            <React.Suspense fallback={<Timeout />}>
                <ProteinSection id={parseInt(id)} />
            </React.Suspense>
        </div>
    )
}

type ProteinSectionProps = {
    id: number
}

export const ProteinSection: React.FC<ProteinSectionProps> = ({ id }) => {
    const protein = resources.protein(id).read()
    const isoforms = resources.isoforms(id).read()

    const [selected, setSelected] = useState<number>(0)

    useEffect(() => setSelected(0), [isoforms])

    const isoform = isoforms[selected]

    return (
        <React.Fragment>
            <h1>
                Protein ID Card - {protein.accession}/{protein.name}
            </h1>
            <p>
                {protein.taxon} - {protein.description}
            </p>
            <div className="form-group">
                <select
                    className="form-control"
                    value={selected}
                    onChange={e => { setSelected(parseInt(e.target.value)) }}
                    disabled={isoforms.length === 1}
                >
                    {isoforms.map((isoform, i) => <IsoformOption key={i} value={i} isoform={isoform} />)}
                </select>
            </div>
            <hr />
            <ul>
                <li><a href="#sequence">Sequence</a></li>
                <li><a href="#vh">VH interactions</a></li>
                {protein.type === 'h' && <li><a href="#hh">HH interactions</a></li>}
            </ul>
            <hr />
            <React.Suspense fallback={<Timeout />}>
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2 id="sequence">Sequence - {isoform.accession} [{isoform.start} - {isoform.stop}]</h2>
                <div className="form-group">
                    <textarea className="form-control" value={isoform.sequence} rows={6} readOnly={true} />
                </div>
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2 id="vh">VH interactions</h2>
                <InteractionTableFetcher type="vh" protein={protein} isoform={isoform} />
                {protein.type === 'h' && (
                    <React.Fragment>
                        <div className="float-right">[<a href="#top">top</a>]</div>
                        <h2 id="hh">HH interactions</h2>
                        <InteractionTableFetcher type="hh" protein={protein} isoform={isoform} />
                    </React.Fragment>
                )}
            </React.Suspense>
        </React.Fragment>
    )
}

type IsoformOptionProps = {
    value: number
    isoform: Isoform
}

const IsoformOption: React.FC<IsoformOptionProps> = ({ value, isoform }) => {
    const { accession, is_canonical, is_mature, start, stop } = isoform

    const label = is_mature
        ? `Mature protein from ${accession} [${start}, ${stop}]`
        : is_canonical ? `${accession} (canonical)` : accession

    return <option value={value}>{label}</option>
}

type InteractionTableFetcherProps = {
    type: 'hh' | 'vh'
    protein: Protein
    isoform: Isoform
}

const InteractionTableFetcher: React.FC<InteractionTableFetcherProps> = ({ type, protein, isoform }) => {
    const interactions = resources.interactions(type, protein.id, isoform.id).read()

    return (
        <InteractionTable
            type={protein.type}
            width={isoform.sequence.length}
            interactions={interactions}
        />
    )
}

const canonicalIndex = (isoforms: Isoform[]) => {
    const indexes = [0, isoforms.length - 1].filter(i => isoforms[i].is_canonical)

    if (indexes.length === 1) {
        return indexes[0]
    }

    throw new Error('canonical isoform id error')
}
