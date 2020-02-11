import React, { useEffect } from 'react'
import Cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import euler from 'cytoscape-euler';
import COSEBilkent from 'cytoscape-cose-bilkent';

Cytoscape.use(euler);
Cytoscape.use(COSEBilkent);

export const CytoscapeWrapper = ({ width, layout, elements, done }) => {
    let cy = null

    useEffect(() => {
        setTimeout(() => cy.resize(), 0)
    }, [cy, width])

    useEffect(() => {
        if (cy === null) return
        const cylayout = cy.layout({ name: layout })
        setTimeout(() => { cylayout.run(); done(false) }, 300)
        return () => cylayout.stop()
    }, [cy, layout, elements, done])

    const stylesheet = [
        {
            selector: 'node[type="h"]',
            style: {
                backgroundColor: 'blue',
                width: '5px',
                height: '5px',
            },
        },
        {
            selector: 'node[type="v"]',
            style: {
                backgroundColor: 'red',
                width: '5px',
                height: '5px',
            },
        },
        {
            selector: 'edge',
            style: {
                width: '1px',
            },
        },
    ]

    return (
        <CytoscapeComponent
            cy={(instance) => { cy = instance }}
            elements={elements}
            layout={{ name: 'random' }}
            style={{ width: `${width}px`, height: `${width}px` }}
            stylesheet={stylesheet}
        />
    )
}
