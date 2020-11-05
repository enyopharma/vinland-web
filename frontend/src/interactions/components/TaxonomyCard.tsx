import React, { useRef, useState } from 'react'

import { useActionCreator } from 'app/hooks'
import { ProgressBar } from 'app/partials'
import { SearchResultList, Overlay } from 'app/search'

import { resources } from '../api'
import { actions } from '../reducers/taxonomy'
import { Taxonomy, Taxon, Name } from '../types'

type TaxonomyCardProps = {
    taxonomy: Taxonomy
}

export const TaxonomyCard: React.FC<TaxonomyCardProps> = ({ taxonomy }) => {
    return taxonomy.taxon === null
        ? <CardWithoutSelectedTaxon />
        : <CardWithSelectedTaxon taxon={taxonomy.taxon} names={taxonomy.names} />
}

const CardWithoutSelectedTaxon: React.FC = () => {
    const select = useActionCreator(actions.select)

    const input = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState<string>('')

    const search = (query: string) => resources.taxa(query).read()

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
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                    <Overlay input={input}>
                        <SearchResultList input={input} query={query} search={search} select={select} />
                    </Overlay>
                </div>
            </div>
        </div>
    )
}

type CardWithoutSelectedTaxonProps = {
    taxon: Taxon
    names: Name[]
}

const CardWithSelectedTaxon: React.FC<CardWithoutSelectedTaxonProps> = ({ taxon, names }) => {
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
                    <RelatedFormRowFetcher ncbi_taxon_id={taxon.ncbi_taxon_id} />
                    <h4>Only protein tagged with:</h4>
                    <NameList ncbi_taxon_id={taxon.ncbi_taxon_id} selected={names} />
                </React.Suspense>
            </div>
        </div>
    )
}

type RelatedFormRowFetcherProps = {
    ncbi_taxon_id: number
}

const RelatedFormRowFetcher: React.FC<RelatedFormRowFetcherProps> = ({ ncbi_taxon_id }) => {
    const { parent, children } = resources.related(ncbi_taxon_id).read()

    const select = useActionCreator(actions.select)

    const selectParent = () => parent && select(parent)

    const selectChild = (value: string) => value !== '' && select(children[parseInt(value)])

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
    ncbi_taxon_id: number
    selected: Name[]
}

const NameList: React.FC<NameListProps> = ({ ncbi_taxon_id, selected }) => {
    const names = resources.names(ncbi_taxon_id).read()

    const update = useActionCreator(actions.update)

    const buttons = names.length === 0
        ? 'no interactor associated to this taxon'
        : names.map((name, i) => <NameButton key={i} name={name} selected={selected} update={update} />)

    return <p>{buttons}</p>
}

type NameButtonProps = {
    name: Name
    selected: Name[]
    update: (names: Name[]) => void
}

const NameButton: React.FC<NameButtonProps> = ({ name, selected, update }) => {
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
