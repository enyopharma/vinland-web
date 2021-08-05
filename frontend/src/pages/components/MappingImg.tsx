import React, { useState } from 'react'
import Modal from 'react-bootstrap4-modal';

import { Mappable } from '../types'

const colors = {
    h: '#6CC3D5',
    v: '#FF7851',
    f: '#FFCE67',
}

const btnclasses = {
    h: 'btn btn-block btn-info',
    v: 'btn btn-block btn-danger',
    f: 'btn btn-block btn-warning',
}

type MappingImgProps = {
    type: 'h' | 'v' | 'f'
    width: number
    mappables: Mappable[]
}

export const MappingImg: React.FC<MappingImgProps> = ({ type, width, mappables }) => {
    const [visible, setVisible] = useState<boolean>(false)

    return (
        <React.Fragment>
            <svg width="100%" height="30" onClick={() => setVisible(true)}>
                <rect width="100%" y="14" height="2" style={{ fill: '#eee', strokeWidth: 0 }} />
                {mappables.map((mapping, i) => <MappingRect key={i} type={type} width={width} mapping={mapping} />)}
            </svg>
            <MappingModal type={type} visible={visible} mappables={mappables} close={() => setVisible(false)} />
        </React.Fragment>
    )
}

type MappingRectProps = {
    type: 'h' | 'v' | 'f'
    width: number
    mapping: Mappable
}

const MappingRect: React.FC<MappingRectProps> = ({ type, width, mapping }) => {
    const startp = ((mapping.start / width) * 100) + '%'
    const stopp = ((mapping.stop / width) * 100) + '%'
    const widthp = (((mapping.stop - mapping.start + 1) / width) * 100) + '%'

    return (
        <React.Fragment>
            <text x={startp} y="10" textAnchor="start" style={{ fontSize: '10px' }}>
                {mapping.start}
            </text>
            <text x={stopp} y="30" textAnchor="end" style={{ fontSize: '10px' }}>
                {mapping.stop}
            </text>
            <rect width={widthp} x={startp} y="13" height="4" style={{ fill: colors[type], strokeWidth: 0 }} />
        </React.Fragment>
    )
}

type MappingModalProps = {
    type: 'h' | 'v' | 'f'
    visible: boolean
    mappables: Mappable[]
    close: () => void
}

const MappingModal: React.FC<MappingModalProps> = ({ type, visible, mappables, close }) => (
    <Modal visible={visible} dialogClassName="modal-lg modal-dialog-centered" onClickBackdrop={close}>
        <div className="modal-header">
            <h5 className="modal-title">Mappings</h5>
        </div>
        {mappables.map((mapping, i) => (
            <div key={i} className="modal-body text-left">
                <h6>Sequence [{mapping.start} - {mapping.stop}]</h6>
                <div className="form-group">
                    <textarea value={mapping.sequence} className="form-control" readOnly={true} />
                </div>
            </div>
        ))}
        <div className="modal-footer">
            <button type="button" className={btnclasses[type]} onClick={() => close()}>
                close
            </button>
        </div>
    </Modal>
)
