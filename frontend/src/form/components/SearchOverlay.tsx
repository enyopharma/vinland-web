import React, { RefObject, useState, useEffect } from 'react'

type SearchOverlayProps = {
    input: RefObject<HTMLInputElement>
}

const isQueryNotEmpty = (query: string | undefined) => !!query && query.trim().length > 0

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ input, children }) => {
    const [display, setDisplay] = useState<boolean>(false)

    useEffect(() => {
        const elem = input.current

        const focus = () => { setDisplay(isQueryNotEmpty(elem?.value)) }
        const blur = () => { setDisplay(false) }

        const keydown = (e: KeyboardEvent) => {
            switch (e.keyCode) {
                case 38:
                    setDisplay(isQueryNotEmpty(elem?.value))
                    break
                case 40:
                    setDisplay(isQueryNotEmpty(elem?.value))
                    break
                case 27:
                    setDisplay(false)
                    break
                default:
                    setDisplay(isQueryNotEmpty(elem?.value))
            }
        }

        elem?.addEventListener('focus', focus)
        elem?.addEventListener('blur', blur)
        elem?.addEventListener('keydown', keydown)

        return () => {
            elem?.removeEventListener('focus', focus)
            elem?.removeEventListener('keydown', keydown)
            elem?.removeEventListener('blur', blur)
        }
    })

    return !display ? null : (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', width: '100%', zIndex: 100 }}>
                {children}
            </div>
        </div>
    )
}
