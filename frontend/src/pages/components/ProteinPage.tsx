import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { ProteinLinkImg, Timeout, Dots } from 'partials'

import { resources } from '../api'
import { canonicalIndex } from '../utils'
import { Resource, Protein, Isoform, Feature, TargetingSequence, Interactor } from '../types'

const FeatureTable = React.lazy(() => import('./FeatureTable').then(module => ({ default: module.FeatureTable })))
const InteractorTable = React.lazy(() => import('./InteractorTable').then(module => ({ default: module.InteractorTable })))
const IsoformSelectbox = React.lazy(() => import('./IsoformSelectbox').then(module => ({ default: module.IsoformSelectbox })))
const TargetingSequenceTable = React.lazy(() => import('./TargetingSequenceTable').then(module => ({ default: module.TargetingSequenceTable })))

export const ProteinPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    const protein_id = parseInt(id)

    const p = resources.protein(protein_id)
    const i = resources.isoforms(protein_id)

    const resource = { read: () => ({ protein: p.read(), isoforms: i.read() }) }

    return (
        <div className="container">
            <React.Suspense fallback={<Fallback />}>
                <ProteinSection key={id} resource={resource} />
            </React.Suspense>
        </div>
    )
}

const Fallback: React.FC = () => (
    <Timeout>
        <div className="text-center">
            Please wait <Dots />
        </div>
    </Timeout>
)

type ProteinSectionProps = {
    resource: Resource<{ protein: Protein, isoforms: Isoform[] }>
}

const ProteinSection: React.FC<ProteinSectionProps> = ({ resource }) => {
    const { protein, isoforms } = resource.read()

    const [selected, setSelected] = useState<number>(canonicalIndex(isoforms))

    switch (protein.type) {
        case 'h': {
            const fs = resources.features(protein.id, isoforms[selected].id)
            const hh = resources.interactors(protein.id, 'h');
            const vh = resources.interactors(protein.id, 'v');
            const ts = resources.tsequences(protein.id);

            const resource = {
                read: () => ({
                    fs: fs.read(),
                    hh: hh.read(),
                    vh: vh.read(),
                    ts: ts.read(),
                })
            }

            return (
                <ProteinHSection
                    protein={protein}
                    isoforms={isoforms}
                    resource={resource}
                    selected={selected}
                    update={setSelected}
                />
            )
        }
        case 'v': {
            const fs = resources.features(protein.id, isoforms[selected].id)
            const vh = resources.interactors(protein.id, 'h');
            const ts = resources.tsequences(protein.id);

            const resource = {
                read: () => ({
                    fs: fs.read(),
                    vh: vh.read(),
                    ts: ts.read(),
                })
            }

            return (
                <ProteinVSection
                    protein={protein}
                    isoforms={isoforms}
                    resource={resource}
                    selected={selected}
                    update={setSelected}
                />
            )
        }
    }
}

type RemoteDataH = {
    fs: Feature[]
    hh: Interactor[]
    vh: Interactor[]
    ts: TargetingSequence[]
}

type ProteinHSectionProps = {
    protein: Protein
    isoforms: Isoform[]
    resource: Resource<RemoteDataH>
    selected: number
    update: (index: number) => void
}

const ProteinHSection: React.FC<ProteinHSectionProps> = ({ protein, isoforms, resource, selected, update }) => {
    const isoform = isoforms[selected]
    const { fs, hh, vh, ts } = resource.read()

    return (
        <React.Fragment>
            <ProteinInfoSection protein={protein} isoforms={isoforms} selected={selected} update={update} />
            <hr />
            <ul>
                <li><a href="#sequence">Sequence</a></li>
                <li><a href="#fs">Sequence features</a></li>
                <li><a href="#vh">VH interactions</a></li>
                <li><a href="#hh">HH interactions</a></li>
                <li><a href="#ts">Targeting sequences</a></li>
            </ul>
            <hr />
            <section className="mb-4">
                <SequenceSection isoform={isoform} />
            </section>
            <section className="mb-4">
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2 id="fs">Sequence features</h2>
                {fs.length === 0
                    ? <EmptyTable type="f" />
                    : <FeatureTable isoform={isoform} features={fs} />
                }
            </section>
            <section className="mb-4">
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2 id="vh">VH interactions</h2>
                {vh.length === 0
                    ? <EmptyTable type="v" />
                    : <InteractorTable type={protein.type} isoform={isoform} interactors={vh} />
                }
            </section>
            <section className="mb-4">
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2 id="hh">HH interactions</h2>
                {hh.length === 0
                    ? <EmptyTable type="h" />
                    : <InteractorTable type={protein.type} isoform={isoform} interactors={hh} />
                }
            </section>
            <section className="mb-4">
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2 id="ts">Targeting sequences</h2>
                {ts.length === 0
                    ? <EmptyTable type="t" />
                    : <TargetingSequenceTable mappings={ts} />
                }
            </section>
        </React.Fragment>
    )
}

type RemoteDataV = {
    fs: Feature[]
    vh: Interactor[]
    ts: TargetingSequence[]
}

type ProteinVSectionProps = {
    protein: Protein
    isoforms: Isoform[]
    resource: Resource<RemoteDataV>
    selected: number
    update: (index: number) => void
}

const ProteinVSection: React.FC<ProteinVSectionProps> = ({ protein, isoforms, resource, selected, update }) => {
    const isoform = isoforms[selected]
    const { fs, vh, ts } = resource.read()

    return (
        <React.Fragment>
            <ProteinInfoSection protein={protein} isoforms={isoforms} selected={selected} update={update} />
            <hr />
            <ul>
                <li><a href="#sequence">Sequence</a></li>
                <li><a href="#fs">Sequence features</a></li>
                <li><a href="#vh">VH interactions</a></li>
                <li><a href="#ts">Targeting sequences</a></li>
            </ul>
            <hr />
            <section className="mb-4">
                <SequenceSection isoform={isoform} />
            </section>
            <section className="mb-4">
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2 id="fs">Sequence features</h2>
                {fs.length === 0
                    ? <EmptyTable type="f" />
                    : <FeatureTable isoform={isoform} features={fs} />
                }
            </section>
            <section className="mb-4">
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2 id="vh">VH interactions</h2>
                {vh.length === 0
                    ? <EmptyTable type="h" />
                    : <InteractorTable type={protein.type} isoform={isoform} interactors={vh} />
                }
            </section>
            <section className="mb-4">
                <h2 id="ts">Targeting sequences</h2>
                {ts.length === 0
                    ? <EmptyTable type="t" />
                    : <TargetingSequenceTable mappings={ts} />
                }
            </section>
        </React.Fragment>
    )
}

type ProteinInfoSectionProps = {
    protein: Protein
    isoforms: Isoform[]
    selected: number
    update: (index: number) => void
}

const ProteinInfoSection: React.FC<ProteinInfoSectionProps> = ({ protein, isoforms, selected, update }) => (
    <React.Fragment>
        <h1>
            <ProteinLinkImg {...protein} /> Protein ID Card - {protein.accession}/{protein.name}
        </h1>
        <p>
            {protein.taxon} - {protein.description}
        </p>
        <div className="form-group">
            <IsoformSelectbox isoforms={isoforms} selected={selected} update={update} />
        </div>
    </React.Fragment>
)

type SequenceSectionProps = {
    isoform: Isoform
}

const SequenceSection: React.FC<SequenceSectionProps> = ({ isoform }) => (
    <React.Fragment>
        <div className="float-right">[<a href="#top">top</a>]</div>
        <h2 id="sequence">{isoform.accession} [{isoform.start} - {isoform.stop}]</h2>
        <div className="form-group">
            <textarea className="form-control" value={isoform.sequence} rows={6} readOnly={true} />
        </div>
    </React.Fragment>
)

type EmptyTableProps = {
    type: 'f' | 'h' | 'v' | 't'
}

const EmptyTable: React.FC<EmptyTableProps> = ({ type }) => (
    <p className="text-center">
        {empty[type]}
    </p>
)

const empty = {
    'f': 'No sequence feature',
    'h': 'No human interactor',
    'v': 'No viral interactor',
    't': 'No targeting sequence',
}
