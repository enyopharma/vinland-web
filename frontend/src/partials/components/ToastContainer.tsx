import React from 'react'
import { ToastContainer as RawToastContainer, toast } from 'react-toastify'
import '../toast.scss'

type Props = {
    target: string
}

export const ToastContainer: React.FC<Props> = ({ target }) => (
    <RawToastContainer
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        rtl={false}
        draggable={false}
        closeOnClick={true}
        closeButton={false}
        position={toast.POSITION.BOTTOM_RIGHT}
        onClick={() => window.document.getElementById(target)?.scrollIntoView(true)}
    />
)
