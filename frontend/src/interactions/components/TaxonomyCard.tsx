import React, { useRef, useState } from 'react'

import { Resource } from 'app/cache'
import { useActionCreator } from 'app/hooks'
import { ProgressBar } from 'app/partials'
import { SearchResult, SearchResultList, Overlay } from 'app/search'

import { resources } from '../api'
import { actions } from '../reducers/taxonomy'
import { Taxonomy, Taxon, RelatedTaxa, Name } from '../types'

type TaxonomyCardProps = {
    taxonomy: Taxonomy
}

export const TaxonomyCard: React.FC<TaxonomyCardProps> = ({ taxonomy }) => {
    const select = useActionCreator(actions.select)
    const [resource, setResource] = useState<Resource<[RelatedTaxa, Name[]]>>(resources.taxon(taxonomy.taxon?.ncbi_taxon_id ?? 0))

    const update = (taxon: Taxon) => {
        select(taxon)
        setResource(resources.taxon(taxon.ncbi_taxon_id))
    }

    return taxonomy.taxon === null
        ? <CardWithoutSelectedTaxon select={update} />
        : (
            <CardWithSelectedTaxon
                taxon={taxonomy.taxon}
                names={taxonomy.names}
                resource={resource}
                select={update}
            />
        )
}

type CardWithoutSelectedTaxonProps = {
    select: (taxon: Taxon) => void
}

const CardWithoutSelectedTaxon: React.FC<CardWithoutSelectedTaxonProps> = ({ select }) => {
    const input = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState<string>('')
    const [resource, setResource] = useState<Resource<SearchResult<Taxon>[]>>(resources.taxa(query))

    const update = (query: string) => {
        setQuery(query)
        setResource(resources.taxa(query))
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="form-group">
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
                            onChange={e => update(e.target.value)}
                        />
                    </div>
                    <Overlay input={input}>
                        <SearchResultList
                            input={input}
                            query={query}
                            resource={resource}
                            select={select}
                        />
                    </Overlay>
                </div>
            </div>
        </div>
    )
}

type CardWithSelectedTaxonProps = {
    taxon: Taxon
    names: Name[]
    resource: Resource<[RelatedTaxa, Name[]]>
    select: (taxon: Taxon) => void
}

const CardWithSelectedTaxon: React.FC<CardWithSelectedTaxonProps> = ({ taxon, names, select, resource }) => {
    const unselect = useActionCreator(actions.unselect)

    return (
        <div className="card">
            <div className="card-body">
                <div className="alert alert-danger">
                    {taxon.name}
                    <button type="button" className="close" onClick={unselect}>
                        &times;
                </button>
                </div>
                <React.Suspense fallback={<ProgressBar type="danger" />}>
                    <h4>Browse taxonomy:</h4>
                    <RelatedFormRow resource={resource} select={select} />
                    <h4>Only protein tagged with:</h4>
                    <NameList resource={resource} selected={names} />
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

    const selectParent = () => parent && select(parent)

    const selectChild = (value: string) => value.length > 0 && select(children[parseInt(value)])

    return (
        <div className="form-row">
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
                    onClick={e => selectParent()}
                >
                    Parent
                </button>
            </div>
        </div>
    )
}

type NameListProps = {
    resource: Resource<[RelatedTaxa, Name[]]>
    selected: Name[]
}

const NameList: React.FC<NameListProps> = ({ resource, selected }) => {
    const names = resource.read()[1]

    const buttons = names.length === 0
        ? 'no interactor associated to this taxon'
        : names.map((name, i) => <NameButton key={i} name={name} selected={selected} />)

    return <p>{buttons}</p>
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
        <button className={classes} onClick={e => update(names)}>
            {name}
        </button>
    )
}
