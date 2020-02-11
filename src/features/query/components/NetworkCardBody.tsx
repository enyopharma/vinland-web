import React, { useState, useEffect, useCallback, useMemo } from 'react'

import { Interaction, Protein } from 'features/query'

import { Element, CytoscapeWrapper } from 'features/network'

type Layout =
    | 'euler'
    | 'cose-bilkent'
    | 'circle'
    | 'random'

type LayoutOption = {
    name: string
    value: Layout
}

const layouts: LayoutOption[] = [
    { name: 'Euler (force directed)', value: 'euler' },
    { name: 'Cose bilkent', value: 'cose-bilkent' },
    { name: 'Circle', value: 'circle' },
    { name: 'Random', value: 'random' },
]

type Props = {
    interactions: Interaction[]
}

export const NetworkCardBody: React.FC<Props> = ({ interactions }) => {
    const [width, setWidth] = useState<number | null>(null)
    const [selected, setSelected] = useState<number>(0)
    const [layout, setLayout] = useState<Layout>('random')
    const [processing, setProcessing] = useState<boolean>(true)

    const updateWidth = () => {
        const elem = document.getElementById('network')
        if (elem === null) return
        setWidth(elem.offsetWidth)
    }

    useEffect(() => {
        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    const elems = useMemo(() => elements(interactions), [interactions])
    const done = useCallback(() => setProcessing(false), [])

    const handleClick = useCallback(() => {
        setProcessing(true)
        setLayout(layouts[selected].value)
    }, [selected])

    return (
        <React.Fragment>
            <div className="card-body">
                <div className="form-row">
                    <div className="col">
                        <select
                            value={selected}
                            className="form-control"
                            onChange={e => setSelected(parseInt(e.target.value))}
                            disabled={processing}
                        >
                            {layouts.map((layout, i) => (
                                <option key={i} value={i}>{layout.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-4">
                        <button
                            className="btn btn-block btn-primary"
                            onClick={e => handleClick()}
                            disabled={processing}
                        >
                            Apply layout
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body" id="network">
                {width === null ? null : (
                    <CytoscapeWrapper
                        width={width}
                        layout={layout}
                        elements={elems}
                        done={done}
                    />
                )}
            </div>
        </React.Fragment>
    )
}

const id = (protein: Protein) => `${protein.species.ncbi_taxon_id}:${protein.name}`

const node = (protein: Protein) => ({
    data: {
        id: id(protein),
        type: protein.type,
        name: protein.name,
    }
})

const edge = (interaction: Interaction) => ({
    data: {
        source: id(interaction.protein1),
        target: id(interaction.protein2),
    }
})

const elements = (interactions: Interaction[]) => {
    const ids: string[] = []
    const elements: Element[] = []
    interactions.forEach(interaction => {
        const id1 = id(interaction.protein1)
        if (!ids.includes(id1)) {
            ids.push(id1)
            elements.push(node(interaction.protein1))
        }
        const id2 = id(interaction.protein2)
        if (!ids.includes(id2)) {
            ids.push(id2)
            elements.push(node(interaction.protein2))
        }
        elements.push(edge(interaction))
    })
    return elements
}
