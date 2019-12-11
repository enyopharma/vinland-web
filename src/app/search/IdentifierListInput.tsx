import React from 'react'
import { useSpring, animated } from 'react-spring'

type Props = {
    name: string,
    identifiers: string,
    update: (identifiers: string) => void
    remove: () => void
}

export const IdentifierListInput: React.FC<Props> = ({ name, identifiers, update, remove }) => {
    const props = useSpring({
        opacity: 1,
        backgroundColor: '#fff',
        from: {
            opacity: 0,
            backgroundColor: '#ccc',
        },
    })

    return (
        <div className="form-group">
            <animated.div style={props}>
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
