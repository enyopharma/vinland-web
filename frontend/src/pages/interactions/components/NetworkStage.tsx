import React, { useRef, useEffect } from 'react'

import { Network } from '../types'

type Props = {
    network: Network
}

export const NetworkStage: React.FC<Props> = ({ network }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const resize = () => {
            const width = ref.current?.clientWidth

            width && network.resize(width)
        }

        window.addEventListener('resize', resize)

        return () => { window.removeEventListener('resize', resize) }
    }, [network])

    useEffect(() => {
        if (ref.current) {
            const stage = network.container(ref.current)

            return () => { stage.remove() }
        }
    }, [network])

    useEffect(() => {
        return () => { network.stop() }
    }, [network])

    return <div ref={ref}></div>
}
