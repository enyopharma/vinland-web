import React, { useState, useEffect } from 'react'

type TimeoutProps = {
    ms?: number
}

export const Timeout: React.FC<TimeoutProps> = ({ ms = 1000 }) => {
    const dots = ['.&nbsp;&nbsp;', '..&nbsp;', '...']

    const [i, setI] = useState(0)
    const [elapsed, setElapsed] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => setElapsed(true), ms)

        return () => clearTimeout(timeout)
    }, [ms])

    useEffect(() => {
        if (!elapsed) return

        const timeout = setTimeout(() => setI(i + 1), 500)

        return () => clearTimeout(timeout)
    }, [elapsed, i])

    if (!elapsed) return null

    return <div className="text-center" dangerouslySetInnerHTML={{ __html: `Please wait ${dots[i % 3]}` }}></div >
}
