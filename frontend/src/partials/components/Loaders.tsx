import React, { useState, useEffect } from 'react'

const dots = ['.', '..', '...']

export const Dots: React.FC = () => {
    const [i, setI] = useState(0)

    useEffect(() => {
        const timeout = setTimeout(() => setI(i + 1), 500)

        return () => clearTimeout(timeout)
    }, [i])

    return <React.Fragment>{dots[i % 3]}</React.Fragment>
}

type TimeoutProps = {
    ms?: number
}

export const Timeout: React.FC<TimeoutProps> = ({ ms = 1000, children }) => {
    const [elapsed, setElapsed] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => setElapsed(true), ms)

        return () => clearTimeout(timeout)
    })

    return elapsed
        ? <React.Fragment>{children}</React.Fragment>
        : null
}

type ProgressBarProps = {
    type?: 'primary' | 'info' | 'danger'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ type = 'primary' }) => {
    const classes = `progress-bar progress-bar-striped progress-bar-animated bg-${type}`

    return (
        <div className="progress">
            <div className={classes} style={{ width: '100%' }}></div>
        </div>
    )
}
