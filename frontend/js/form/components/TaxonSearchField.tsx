import React, { useState, useEffect, useRef } from 'react'

import { Taxon, TaxonSelection, isSelectedTaxon } from 'form/types'

import * as api from 'form/api/taxa'
import { QueryResultStatuses } from 'form/api/taxa'

type Props = {
    selection: TaxonSelection,
    select: (taxon: TaxonSelection) => void
    unselect: () => void
}

export const TaxonSearchField: React.FC<Props> = ({ selection, select, unselect }) => {
    const limit = 5

    const [query, setQuery] = useState<string>('');
    const [active, setActive] = useState<number>(null);
    const [display, setDisplay] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [taxa, setTaxa] = useState<Taxon[]>([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            api.taxa(query).then(result => setTaxa(result.status == QueryResultStatuses.SUCCESS
                ? result.data
                : []
            ))
        }, 300)

        return () => clearTimeout(timeout)
    }, [query])

    useEffect(() => { setFetching(true) }, [query])

    useEffect(() => { setFetching(false) }, [taxa])

    useEffect(() => { setActive(taxa.length == 0 ? null : 0) }, [display])

    useEffect(() => { if (isSelectedTaxon(selection)) setDisplay(false) }, [selection])

    const onBlur = e => setDisplay(false)

    const onFocus = e => setDisplay(true)

    const onClick = e => setDisplay(true)

    const onChange = e => setQuery(e.target.value)

    const onKeyDown = e => {
        switch (e.keyCode) {
            case 13:
                if (active != null) select(taxa[active])
                break
            case 27:
                setDisplay(!display)
                break
            case 38:
                active == null || active == 0
                    ? setActive(Math.min(taxa.length, limit) - 1)
                    : setActive(active - 1)
                break
            case 40:
                active == null || active == Math.min(taxa.length, limit) - 1
                    ? setActive(0)
                    : setActive(active + 1)
                break
        }
    }

    if (isSelectedTaxon(selection)) {
        return (
            <div className="alert alert-danger">
                {selection.name}
                <button type="button" className="close" onClick={() => unselect()}>
                    &times;
                </button>
            </div>
        )
    }

    return (
        <div style={{ position: 'relative' }} >
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        {fetching ? '?' : '@'}
                    </span>
                </div>
                <input
                    type="text"
                    value={query}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onClick={onClick}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    className="form-control form-control-lg"
                />
            </div>
            {
                !display || taxa.length == 0 ? null : (
                    <div style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
                        <ul className="list-group">
                            {taxa.slice(0, limit).map((taxa, i) => (
                                <li
                                    key={i}
                                    className={'list-group-item' + (active == i ? ' active' : '')}
                                    onMouseOver={() => setActive(i)}
                                    onMouseDown={() => select(taxa)}
                                >
                                    {taxa.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}
