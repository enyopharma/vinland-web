import React, { useRef, useEffect, useState } from 'react'

import { actions } from '../reducers/nav'
import { Network, Selection, Taxon } from '../types'
import { useSelector, useActionCreator } from '../hooks'
import { ProteinLink } from 'partials'

type NetworkCardBodyProps = {
    network: Network
}

export const NetworkCardBody: React.FC<NetworkCardBodyProps> = ({ network }) => (
    <React.Fragment>
        <div className="card-body">
            <NetworkContainer network={network} />
        </div>
        <div className="card-body">
            <div className="row">
                <div className="col">
                    <button type="button" className="btn btn-block btn-primary" onClick={() => download(network)}>
                        Save image
                    </button>
                </div>
                <div className="col">
                    <button type="button" className="btn btn-block btn-primary" onClick={() => network.selectNeighbors()}>
                        Select neighbors
                    </button>
                </div>
                <div className="col-2">
                    <LabelsButton network={network} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <RatioRange network={network} />
                </div>
                <div className="col-2">
                    <button type="button" className="btn btn-block btn-primary" onClick={() => network.stop()}>
                        Stop layout
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h3>Viral species on the network</h3>
                    {network.species.map((species, i) => <SpeciesButton key={i} {...species} />)}
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h3>Viral protein selection</h3>
                    <SelectionList network={network} />
                </div>
            </div>
        </div>
    </React.Fragment >
)

type LabelsButtonProps = {
    network: Network
}

const LabelsButton: React.FC<LabelsButtonProps> = ({ network, children }) => {
    const labels = useSelector(state => state.nav.network.labels)
    const setLabels = useActionCreator(actions.setNetworkLabels)

    // prevents from changing labels too many times quickly
    useEffect(() => {
        const timeout = setTimeout(() => network.setLabels(labels), 100)

        return () => { clearTimeout(timeout) }
    }, [network, labels])

    return (
        <button type="button" className="btn btn-block btn-primary" onClick={() => setLabels(!labels)}>
            {labels ? 'Hide labels' : 'Show labels'}
        </button>
    )
}

type RatioRangeProps = {
    network: Network
}

const RatioRange: React.FC<RatioRangeProps> = ({ network }) => {
    const ratio = useSelector(state => state.nav.network.ratio)
    const setRatio = useActionCreator(actions.setNetworkRatio)

    // prevents from changing ratio too many times quickly
    useEffect(() => {
        const timeout = setTimeout(() => network.setRatio(ratio), 100)

        return () => { clearTimeout(timeout) }
    }, [network, ratio])

    return (
        <input
            type="range"
            min={0}
            max={1000}
            value={ratio}
            className="custom-range"
            onChange={e => setRatio(parseInt(e.target.value))}
        />
    )
}

type SpeciesButtonProps = {
    species: Taxon
    color: string
    select: () => void
}

const SpeciesButton: React.FC<SpeciesButtonProps> = ({ species, color, select }) => (
    <button type="button" className="m-1 btn btn-sm btn-outline-primary" onClick={() => { select() }}>
        <span style={{ color }}>&#11044;</span> {species.name}
    </button>
)

type SelectionListProps = {
    network: Network
}

const SelectionList: React.FC<SelectionListProps> = ({ network }) => {
    const [selection, setSelection] = useState<Selection[]>([])

    useEffect(() => setSelection(network.getSelection()), [network])

    useEffect(() => network.onSelection(() => setSelection(network.getSelection())), [network])

    return selection.length === 0
        ? <p>No viral protein selected</p>
        : (
            <ul>
                {selection.map((entry, i) => (
                    <li key={i}>
                        {entry.name} ({entry.species.name}) =&gt; { entry.proteins
                            .map<React.ReactNode>((protein, p) => <ProteinLink key={p} {...protein} target="_blank">{protein.accession}</ProteinLink>)
                            .reduce((prev, curr) => [prev, ', ', curr])}
                    </li>
                ))}
            </ul>
        )
}

type NetworkContainerProps = {
    network: Network
}

const NetworkContainer: React.FC<NetworkContainerProps> = ({ network }) => {
    const ref = useRef<HTMLDivElement>(null)

    // prevents from the network to go out of the container bounds when resizing the window
    useEffect(() => {
        const resize = () => {
            const width = ref.current?.clientWidth

            if (width) network.resize(width)
        }

        window.addEventListener('resize', resize)

        return () => { window.removeEventListener('resize', resize) }
    }, [network])

    // prevents from computing multiple layout at once
    useEffect(() => () => { network.stop() }, [network])

    // attaches/removes the network to the container
    useEffect(() => {
        if (!ref.current) return

        network.container(ref.current)

        return () => { network.remove() }
    }, [network])

    return <div ref={ref}></div>
}

const download = (network: Network) => {
    const data = network.image()

    if (!data) return

    const elem = document.createElement('a')
    elem.download = 'network.png'
    elem.href = data
    elem.target = '_blank';
    elem.click()
}
