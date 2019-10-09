import React from 'react'

import { AppProps } from 'form/props';

import { IdentifierCard } from './IdentifierCard'
import { TaxonSearchField } from './TaxonSearchField'
import { HHOptionsFields } from './Options/HHOptionsFields'
import { VHOptionsFields } from './Options/VHOptionsFields'
import { PublicationsOptionsFields } from './Options/PublicationsOptionsFields'
import { MethodsOptionsFields } from './Options/MethodsOptionsFields'
import { QueryResultCard } from './QueryResultCard'

export const Form: React.FC<AppProps> = (props) => {
    return (
        <form action="#" className="form-horizontal">
            <fieldset>
                <legend>Human protein identifiers</legend>
                <IdentifierCard {...props.identifiers} />
            </fieldset>
            <fieldset>
                <legend>Viral taxon</legend>
                <div className="card">
                    <div className="card-body">
                        <TaxonSearchField {...props.taxon} />
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>PPI display options</legend>
                <div className="card">
                    <div className="card-body">
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
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>Query result</legend>
                <QueryResultCard {...props.interactions} limit={10} />
            </fieldset>
        </form>
    );
}
