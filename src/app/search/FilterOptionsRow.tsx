import React from 'react'

type Props = {
    publications: number,
    methods: number,
    setPublicationsThreshold: (threshold: number) => void
    setMethodsThreshold: (threshold: number) => void
}

export const FilterOptionsRow: React.FC<Props> = ({ publications, methods, setPublicationsThreshold, setMethodsThreshold }) => (
    <div className="row">
        <div className="col">
            <label htmlFor="publications">
                At least {publications} {publications === 1 ? 'publication' : 'publications'} describing PPIs
                </label>
            <input
                id="publications"
                type="range"
                className="custom-range"
                value={publications}
                min="1"
                max="10"
                onChange={e => setPublicationsThreshold(parseInt(e.target.value))}
            />
        </div>
        <div className="col">
            <label htmlFor="publications">
                At least {methods} {methods === 1 ? 'method' : 'methods'} describing PPIs
                </label>
            <input
                id="publications"
                type="range"
                className="custom-range"
                value={methods}
                min="1"
                max="10"
                onChange={e => setMethodsThreshold(parseInt(e.target.value))}
            />
        </div>
    </div>
)
