import React, { useCallback } from 'react'
import { ToastContainer as RawToastContainer, toast } from 'react-toastify'
import './styles.scss'

type Props = {
    readonly target: string
}

export const ToastContainer: React.FC<Props> = ({ target }) => {
    const scrollToResult = useCallback(() => {
        const elem = window.document.getElementById(target)
        if (elem) elem.scrollIntoView(true);
    }, [target])

    return (
        <RawToastContainer
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            rtl={false}
            draggable={false}
            closeOnClick={true}
            closeButton={false}
            position={toast.POSITION.BOTTOM_RIGHT}
            onClick={scrollToResult}
        />
    )
}
