import React, { useRef, useState } from 'react'

import { ProgressBar } from 'partials'

import { resources } from '../api'
import { actions } from '../reducers/taxonomy'
import { useSelector, useActionCreator } from '../hooks'
import { Resource, SearchResult, Taxon, RelatedTaxa, Name } from '../types'

import { SearchOverlay } from './SearchOverlay'
import { SearchResultList } from './SearchResultList'

const useTaxon = (): [Taxon | null, Resource<[RelatedTaxa, Name[]]>, (taxon: Taxon) => void] => {
    const taxon = useSelector(state => state.taxonomy.taxon)
    const [resource, setResource] = useState<Resource<[RelatedTaxa, Name[]]>>(resources.taxon(taxon?.ncbi_taxon_id ?? 0))
    const select = useActionCreator(actions.select)

    return [taxon, resource, (taxon: Taxon) => {
        select(taxon)
        setResource(resources.taxon(taxon.ncbi_taxon_id))
    }]
}

export const TaxonomyCard: React.FC = () => {
    const [taxon, resource, setTaxon] = useTaxon()

    return taxon === null
        ? <CardWithoutSelectedTaxon select={setTaxon} />
        : <CardWithSelectedTaxon taxon={taxon} resource={resource} select={setTaxon} />
}

type CardWithoutSelectedTaxonProps = {
    select: (taxon: Taxon) => void
}

const useQuery = (init: string = ''): [string, Resource<SearchResult<Taxon>[]>, (query: string) => void] => {
    const [query, setQuery] = useState<string>(init)
    const [resource, setResource] = useState<Resource<SearchResult<Taxon>[]>>(resources.taxa(query))

    return [query, resource, (query: string) => {
        setQuery(query)
        setResource(resources.taxa(query))
    }]
}

const CardWithoutSelectedTaxon: React.FC<CardWithoutSelectedTaxonProps> = ({ select }) => {
    const input = useRef<HTMLInputElement>(null)
    const [query, resource, setQuery] = useQuery('')

    return (
        <div className="card">
            <div className="card-body">
                <div className="form-group mb-0">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">@</span>
                        </div>
                        <input
                            ref={input}
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Search for a viral species"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                    <SearchOverlay input={input}>
                        <SearchResultList
                            input={input}
                            query={query}
                            resource={resource}
                            select={select}
                        />
                    </SearchOverlay>
                </div>
            </div>
        </div>
    )
}

type CardWithSelectedTaxonProps = {
    taxon: Taxon
    resource: Resource<[RelatedTaxa, Name[]]>
    select: (taxon: Taxon) => void
}

const CardWithSelectedTaxon: React.FC<CardWithSelectedTaxonProps> = ({ taxon, select, resource }) => {
    const unselect = useActionCreator(actions.unselect)

    return (
        <div className="card">
            <div className="card-body">
                <div className="alert alert-danger mb-4">
                    {taxon.name}
                    <button type="button" className="close" onClick={unselect}>
                        &times;
                    </button>
                </div>
                <React.Suspense fallback={<ProgressBar type="danger" />}>
                    <h4>Browse taxonomy:</h4>
                    <RelatedFormRow resource={resource} select={select} />
                    <h4>Only protein tagged with:</h4>
                    <NameList resource={resource} />
                </React.Suspense>
            </div>
        </div>
    )
}

type RelatedFormRowProps = {
    resource: Resource<[RelatedTaxa, Name[]]>
    select: (taxon: Taxon) => void
}

const RelatedFormRow: React.FC<RelatedFormRowProps> = ({ resource, select }) => {
    const { parent, children } = resource.read()[0]

    const selectParent = () => {
        if (parent) select(parent)
    }

    const selectChild = (value: string) => {
        if (value.length > 0) select(children[parseInt(value)])
    }

    return (
        <div className="form-row mb-4">
            <div className="col">
                <select
                    value=""
                    className="form-control"
                    onChange={e => selectChild(e.target.value)}
                >
                    <option value="" disabled>Sub-taxa</option>
                    {children.map((taxon, i) => (
                        <option key={i} value={i}>{taxon.name}</option>
                    ))}
                </select>
            </div>
            <div className="col-2">
                <button
                    className="btn btn-block btn-danger"
                    title={parent === null ? undefined : parent.name}
                    disabled={parent === null}
                    onClick={() => selectParent()}
                >
                    Parent
                </button>
            </div>
        </div>
    )
}

type NameListProps = {
    resource: Resource<[RelatedTaxa, Name[]]>
}

const NameList: React.FC<NameListProps> = ({ resource }) => {
    const names = resource.read()[1]

    const selected = useSelector(state => state.taxonomy.names)

    const buttons = names.length === 0
        ? 'no interactor associated to this taxon'
        : names.map((name, i) => <NameButton key={i} name={name} selected={selected} />)

    return <p className="mb-0">{buttons}</p>
}

type NameButtonProps = {
    name: Name
    selected: Name[]
}

const NameButton: React.FC<NameButtonProps> = ({ name, selected }) => {
    const update = useActionCreator(actions.update)

    const classes = selected.includes(name)
        ? 'm-1 btn btn-sm btn-danger'
        : 'm-1 btn btn-sm btn-outline-danger'

    const names = selected.includes(name)
        ? selected.filter(n => n !== name)
        : [...selected, name]

    return (
        <button className={classes} onClick={() => update(names)}>
            {name}
        </button>
    )
}
