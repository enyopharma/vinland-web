import React, { createRef, useState, useEffect } from 'react'

import { Annotation } from 'form/types'

type Props = {
    select: (annotation: Annotation) => void
}

export const AnnotationSearchField: React.FC<Props> = ({ select }) => {
    const ref = createRef<HTMLInputElement>()

    const [source, setSource] = useState<string>('')

    useEffect(() => {
        // if (source.length > 0) ref.current.focus()
        if (source.length > 0) select({
            source: source,
            ref: 'GO:0005264',
            name: 'some go term',
            identifiers: ['O15234', 'Q9NUU7', 'Q8WYP5', 'Q9NPA8', 'Q06787', 'Q92945', 'Q9UN86', 'P38919', 'Q9GZV4', 'Q6IS14', 'P42704', 'Q96A72', 'Q14764', 'O00159', 'Q9BTX1', 'Q9UND3', 'P49790', 'O75694', 'Q5SRE5', 'Q92621', 'Q8NFH4', 'Q8NFH3', 'Q9UKX7', 'Q8NFH5', 'Q7Z3B4', 'P37198', 'Q9BW27', 'Q99567', 'Q8N1F7', 'P52948', 'Q9BVL2', 'O15504', 'Q9NPJ8', 'Q96HA1', 'A6NF01', 'A8CG34', 'Q8TEM1', 'Q96PU8', 'Q32P51', 'Q9H2T7', 'P49792', 'P61578', 'P61579', 'P61571', 'Q69383', 'P61572', 'P61573', 'P61574', 'P61575', 'P61576', 'Q9H1J1', 'P09651', 'P55735', 'Q96EE3', 'Q9HC62', 'O95271', 'P12270', 'O14980', 'Q9UIA9']
        })
    }, [source])

    return (
        <div style={{ position: 'relative' }}>
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        @
                </span>
                </div>
                <select
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    className="form-control form-control-lg col-2"
                >
                    <option value=""></option>
                    <option value="gene-ontology">Gene ontology</option>
                </select>
                <input
                    ref={ref}
                    type="text"
                    className="form-control form-control-lg"
                    disabled={source == ''}
                />
            </div>
        </div>
    )
}
