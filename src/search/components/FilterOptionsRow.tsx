import React from 'react'

type Props = {
    publications: number
    methods: number
    setPublications: (publications: number) => void
    setMethods: (methods: number) => void
}

export const FilterOptionsRow: React.FC<Props> = ({ publications, methods, setPublications, setMethods }) => (
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
                onChange={e => setPublications(parseInt(e.target.value))}
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
                onChange={e => setMethods(parseInt(e.target.value))}
            />
        </div>
    </div>
)
