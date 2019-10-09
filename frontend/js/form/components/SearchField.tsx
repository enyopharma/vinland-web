import React, { useState, useEffect } from 'react'

import { SearchResult } from 'form/types'

type Props<T> = {
    result: SearchResult<T>
    select: (value: T) => void
    children: React.ReactNode
}

export const SearchField: <T>(p: Props<T>) => React.ReactElement<Props<T>> = ({ result, select, children }) => {
    const regex = result.query.split('+')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .join('|')

    const highlight = (label) => {
        return regex.length > 0
            ? label.replace(new RegExp('(' + regex + ')', 'gi'), '<strong>$1</strong>')
            : label
    }

    const [active, setActive] = useState<number>(null)
    const [display, setDisplay] = useState<boolean>(false)

    useEffect(() => setActive(null), [display])

    const doSelect = value => {
        setDisplay(false)
        select(value)
    }

    const onBlur = e => {
        if (e.target.type == 'text') setDisplay(false)
    }

    const onFocus = e => {
        if (e.target.type == 'text') setDisplay(true)
    }

    const onClick = e => {
        if (e.target.type == 'text') setDisplay(true)
    }

    const onKeyDown = e => {
        if (e.target.type == 'text') {
            switch (e.keyCode) {
                case 13:
                    if (active != null) doSelect(result.hints[active].value)
                    break
                case 27:
                    setDisplay(!display)
                    break
                case 38:
                    active == null || active == 0
                        ? setActive(Math.min(result.hints.length, result.limit) - 1)
                        : setActive(active - 1)
                    break
                case 40:
                    active == null || active == Math.min(result.hints.length, result.limit) - 1
                        ? setActive(0)
                        : setActive(active + 1)
                    break
            }
        }
    }

    const getOnMouseOver = (active: number) => e => setActive(active)

    const getOnMouseDown = value => e => doSelect(value)

    return (
        <div style={{ position: 'relative' }} onFocus={onFocus} onBlur={onBlur} onClick={onClick} onKeyDown={onKeyDown}>
            {children}
            {
                display && result.hints.length > 0 ? (
                    <div style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
                        <ul className="list-group">
                            {result.hints.slice(0, result.limit).map((hint, i) => (
                                <li
                                    key={i}
                                    className={'list-group-item' + (active == i ? ' active' : '')}
                                    onMouseOver={getOnMouseOver(i)}
                                    onMouseDown={getOnMouseDown(hint.value)}
                                    dangerouslySetInnerHTML={{ __html: highlight(hint.label) }}
                                >
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null
            }
        </div>
    )
}
