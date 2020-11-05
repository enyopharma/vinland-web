import React, { useState, useEffect } from 'react'

type TimeoutProps = {
    ms?: number
}

export const Timeout: React.FC<TimeoutProps> = ({ ms = 1000, children }) => {
    const [elapsed, setElapsed] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => setElapsed(true), ms)

        return () => clearTimeout(timeout)
    }, [ms])

    return elapsed
        ? <React.Fragment>children</React.Fragment>
        : null
}
