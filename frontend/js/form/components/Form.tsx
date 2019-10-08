import React from 'react'

import { AppProps } from 'form/props';

import { IdentifierSection } from './IdentifierSection'
import { TaxonSearchField } from './TaxonSearchField'
import { HHOptionsFields } from './Options/HHOptionsFields'
import { VHOptionsFields } from './Options/VHOptionsFields'
import { PublicationsOptionsFields } from './Options/PublicationsOptionsFields'
import { MethodsOptionsFields } from './Options/MethodsOptionsFields'
import { QueryResultSection } from './QueryResultSection'

export const Form: React.FC<AppProps> = (props) => {
    return (
        <form action="#" className="form-horizontal">
            <div className="row">
                <div className="col">
                    <fieldset>
                        <legend>Human protein identifiers</legend>
                        <div className="row">
                            <div className="col">
                                <IdentifierSection {...props.identifiers} />
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <fieldset>
                        <legend>Viral taxon</legend>
                        <div className="row">
                            <div className="col">
                                <TaxonSearchField {...props.taxon} />
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <fieldset>
                        <legend>PPI display options</legend>
                        <div className="row">
                            <div className="col">
                                <HHOptionsFields {...props.hh} />
                            </div>
                            <div className="col">
                                <VHOptionsFields {...props.vh} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <PublicationsOptionsFields {...props.publications} />
                            </div>
                            <div className="col">
                                <MethodsOptionsFields {...props.methods} />
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <QueryResultSection {...props.interactions} />
                </div>
            </div>
        </form>
    );
}
