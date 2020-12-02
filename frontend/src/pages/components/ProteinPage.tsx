import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { ProteinLinkImg, Timeout, Dots } from 'partials'

import { resources } from '../api'
import { canonicalIndex } from '../utils'
import { Resource, Protein, Isoform, Interactor } from '../types'

const InteractorTable = React.lazy(() => import('./InteractorTable').then(module => ({ default: module.InteractorTable })))
const IsoformSelectbox = React.lazy(() => import('./IsoformSelectbox').then(module => ({ default: module.IsoformSelectbox })))

type RemoteData = {
    protein: Protein
    isoforms: Isoform[]
}

const getRemoteDataResource = (id: number): Resource<RemoteData> => {
    const protein = resources.protein(id)
    const isoforms = resources.isoforms(id)

    return {
        read: () => ({
            protein: protein.read(),
            isoforms: isoforms.read(),
        })
    }
}

export const ProteinPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    const resource = getRemoteDataResource(parseInt(id))

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
    resource: Resource<RemoteData>
}

const ProteinSection: React.FC<ProteinSectionProps> = ({ resource }) => {
    const { protein, isoforms } = resource.read()

    const [selected, setSelected] = useState<number>(canonicalIndex(isoforms))

    switch (protein.type) {
        case 'h':
            const r1 = resources.interactors(protein.id, 'h')
            const r2 = resources.interactors(protein.id, 'v')

            return (
                <ProteinHSection
                    protein={protein}
                    isoforms={isoforms}
                    resource1={r1}
                    resource2={r2}
                    selected={selected}
                    update={setSelected}
                />
            )
        case 'v':
            const r = resources.interactors(protein.id, 'h')

            return (
                <ProteinVSection
                    protein={protein}
                    isoforms={isoforms}
                    resource={r}
                    selected={selected}
                    update={setSelected}
                />
            )
    }
}

type ProteinHSectionProps = {
    protein: Protein
    isoforms: Isoform[]
    resource1: Resource<Interactor[]>
    resource2: Resource<Interactor[]>
    selected: number
    update: (index: number) => void
}

const ProteinHSection: React.FC<ProteinHSectionProps> = ({ protein, isoforms, resource1, resource2, selected, update }) => {
    const isoform = isoforms[selected]
    const interactors1 = resource1.read()
    const interactors2 = resource2.read()

    return (
        <React.Fragment>
            <ProteinInfoSection protein={protein} isoforms={isoforms} selected={selected} update={update} />
            <hr />
            <ul>
                <li><a href="#sequence">Sequence</a></li>
                <li><a href="#vh">VH interactions</a></li>
                <li><a href="#hh">HH interactions</a></li>
            </ul>
            <hr />
            <SequenceSection isoform={isoform} />
            <div className="float-right">[<a href="#top">top</a>]</div>
            <h2 id="vh">VH interactions</h2>
            {interactors1.length === 0
                ? <EmptyTable type="v" />
                : <InteractorTable type={protein.type} isoform={isoform} interactors={interactors2} />
            }
            <div className="float-right">[<a href="#top">top</a>]</div>
            <h2 id="hh">HH interactions</h2>
            {interactors2.length === 0
                ? <EmptyTable type="h" />
                : <InteractorTable type={protein.type} isoform={isoform} interactors={interactors1} />
            }
        </React.Fragment>
    )
}

type ProteinVSectionProps = {
    protein: Protein
    isoforms: Isoform[]
    resource: Resource<Interactor[]>
    selected: number
    update: (index: number) => void
}

const ProteinVSection: React.FC<ProteinVSectionProps> = ({ protein, isoforms, resource, selected, update }) => {
    const isoform = isoforms[selected]
    const interactors = resource.read()

    return (
        <React.Fragment>
            <ProteinInfoSection protein={protein} isoforms={isoforms} selected={selected} update={update} />
            <hr />
            <ul>
                <li><a href="#sequence">Sequence</a></li>
                <li><a href="#vh">VH interactions</a></li>
            </ul>
            <hr />
            <SequenceSection isoform={isoforms[selected]} />
            <div className="float-right">[<a href="#top">top</a>]</div>
            <h2 id="vh">VH interactions</h2>
            {interactors.length === 0
                ? <EmptyTable type="h" />
                : <InteractorTable type={protein.type} isoform={isoform} interactors={interactors} />
            }
        </React.Fragment>
    )
}

type ProteinInfoSection = {
    protein: Protein
    isoforms: Isoform[]
    selected: number
    update: (index: number) => void
}

const ProteinInfoSection: React.FC<ProteinInfoSection> = ({ protein, isoforms, selected, update }) => (
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
    type: 'h' | 'v'
}

const EmptyTable: React.FC<EmptyTableProps> = ({ type }) => (
    <p className="text-center">
        {empty[type]}
    </p>
)

const empty = {
    'h': 'No human interactor',
    'v': 'No viral interactor',
}
