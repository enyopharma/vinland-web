import React, { RefObject, useState, useEffect } from 'react'

type Props = {
    input: RefObject<HTMLInputElement>
}

const isQueryNotEmpty = (query: string) => query.trim().length > 0

export const Overlay: React.FC<Props> = ({ input, children }) => {
    const [display, setDisplay] = useState<boolean>(false)

    useEffect(() => {
        if (input.current) {
            const target = input.current

            const focus = () => { setDisplay(isQueryNotEmpty(target.value)) }
            const blur = () => { setDisplay(false) }

            const keydown = (e: KeyboardEvent) => {
                switch (e.keyCode) {
                    case 38:
                        setDisplay(isQueryNotEmpty(target.value))
                        break
                    case 40:
                        setDisplay(isQueryNotEmpty(target.value))
                        break
                    case 27:
                        setDisplay(false)
                        break
                    default:
                        setDisplay(isQueryNotEmpty(target.value))
                }
            }

            target.addEventListener('focus', focus)
            target.addEventListener('blur', blur)
            target.addEventListener('keydown', keydown)

            return () => {
                target.removeEventListener('focus', focus)
                target.removeEventListener('keydown', keydown)
                target.removeEventListener('blur', blur)
            }
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
