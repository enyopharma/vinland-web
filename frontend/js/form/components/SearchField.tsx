import React, { useState } from 'react'

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

    const [active, setActive] = useState(null)
    const [display, setDisplay] = useState(false)

    const onBlur = e => setDisplay(false)

    const onClick = e => setDisplay(true)

    const onKeyDown = e => {
        switch (e.keyCode) {
            case 13:
                if (active != null) select(result.hints[active].value)
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

    return (
        <div style={{ position: 'relative' }} onClick={onClick} onBlur={onBlur} onKeyDown={onKeyDown}>
            {children}
            {
                !display || result.hints.length == 0 ? null : (
                    <div style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
                        <ul className="list-group">
                            {result.hints.slice(0, result.limit).map((hint, i) => (
                                <li
                                    key={i}
                                    className={'list-group-item' + (active == i ? ' active' : '')}
                                    onMouseOver={() => setActive(i)}
                                    onMouseDown={() => select(hint.value)}
                                    dangerouslySetInnerHTML={{ __html: highlight(hint.label) }}
                                >
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}
