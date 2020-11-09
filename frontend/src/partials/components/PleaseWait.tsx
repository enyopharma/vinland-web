import React, { useState, useEffect } from 'react'

const dots = ['.&nbsp;&nbsp;', '..&nbsp;', '...']

export const PleaseWait = () => {
    const [i, setI] = useState(0)

    useEffect(() => {
        const timeout = setTimeout(() => setI(i + 1), 500)

        return () => clearTimeout(timeout)
    }, [i])

    return <span dangerouslySetInnerHTML={{ __html: `Please wait ${dots[i % 3]}` }}></span>
}
