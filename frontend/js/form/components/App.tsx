import React from 'react'

import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

import { reducer } from 'form/reducer'

import { mapStateToProps } from 'form/props'
import { mapDispatchToProps } from 'form/props'
import { mergeProps } from 'form/props'

import { Form } from './Form'

const store = createStore(reducer)

const ConnectedForm = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Form);

export const App = (
    <Provider store={store}>
        <ConnectedForm />
    </Provider>
)
