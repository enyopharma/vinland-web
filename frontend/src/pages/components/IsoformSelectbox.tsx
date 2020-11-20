import React from 'react'

import { Isoform } from '../types'

type IsoformSelectboxProps = {
    isoforms: Isoform[]
    selected: number
    update: (i: number) => void
}

export const IsoformSelectbox: React.FC<IsoformSelectboxProps> = ({ isoforms, selected, update }) => (
    <select
        className="form-control"
        value={selected}
        onChange={e => { update(parseInt(e.target.value)) }}
        disabled={isoforms.length === 1}
    >
        {isoforms.map((isoform, i) => <IsoformOption key={i} value={i} isoform={isoform} />)}
    </select>
)

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
