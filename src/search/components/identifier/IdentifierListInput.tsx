import React from 'react'
import { useSpring, animated } from 'react-spring'

type Props = {
    i: number
    name: string,
    identifiers: string,
    update: (identifiers: string) => void
    remove: () => void
}

export const IdentifierListInput: React.FC<Props> = ({ i, name, identifiers, update, remove }) => {
    const props = useSpring({
        config: { duration: 500 },
        from: { opacity: 0 },
        to: { opacity: 1 },
    })

    return (
        <div className="form-group">
            <animated.div style={i === 0 ? {} : props}>
                <label>{name}</label>
                <div className="input-group">
                    <textarea
                        className="form-control"
                        placeholder="Uniprot accession numbers or names spaced by commas or new lines."
                        value={identifiers}
                        onChange={e => update(e.target.value)}
                    />
                    <div className="input-group-append">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => remove()}
                        >X</button>
                    </div>
                </div>
            </animated.div>
        </div>
    )
}
