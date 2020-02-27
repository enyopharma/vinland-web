import React from 'react'
import { ToastContainer as RawToastContainer, toast } from 'react-toastify'

type Props = {
    target: string
}

export const ToastContainer: React.FC<Props> = ({ target }) => {
    const scrollToResult = () => {
        const elem = window.document.getElementById(target)
        if (elem) elem.scrollIntoView(true);
    }

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
