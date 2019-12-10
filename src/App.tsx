import React from 'react';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { reducer as search } from './app/search/src/reducer'

import { Navbar } from './app/Navbar'
const HomePage = React.lazy(() => import('./app/HomePage').then(module => ({ default: module.HomePage })))
const SearchPage = React.lazy(() => import('./app/search/SearchPage').then(module => ({ default: module.SearchPage })))

const reducer = combineReducers({ search })

const store = createStore(reducer)

export const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Navbar />
                <React.Suspense fallback="null">
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/interactions" component={SearchPage} />
                    </Switch>
                </React.Suspense>
            </BrowserRouter>
        </Provider>
    );
}
