import React, { useState, useEffect } from 'react'

const dots = ['.&nbsp;&nbsp;', '..&nbsp;', '...']

export const Dots: React.FC = () => {
    const [i, setI] = useState(0)

    useEffect(() => {
        const timeout = setTimeout(() => setI(i + 1), 500)

        return () => clearTimeout(timeout)
    }, [i])

    return <span dangerouslySetInnerHTML={{ __html: dots[i % 3] }}></span>
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
        : <div dangerouslySetInnerHTML={{ __html: '&nbsp;' }}></div>
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
