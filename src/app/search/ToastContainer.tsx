import React from 'react'
import { ToastContainer as Toastify, toast } from 'react-toastify'
import '../../styles/toastify.scss'

const scrollToResult = () => {
    const results = window.document.getElementById('results')
    if (results) {
        results.scrollIntoView(true);
    }
}

export const ToastContainer = () => (
    <Toastify
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
