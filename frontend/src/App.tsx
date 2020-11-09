import React, { useEffect } from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';

import { Navbar, Timeout, PleaseWait } from 'partials'
import { store as interactions } from 'interactions/store'

const HomePage = React.lazy(() => import('home').then(module => ({ default: module.HomePage })))
const ProteinPage = React.lazy(() => import('proteins').then(module => ({ default: module.ProteinPage })))
const ProteinSearchPage = React.lazy(() => import('proteins').then(module => ({ default: module.ProteinSearchPage })))
const InteractionPage = React.lazy(() => import('interactions').then(module => ({ default: module.InteractionPage })))
const InteractionSearchPage = React.lazy(() => import('interactions').then(module => ({ default: module.InteractionSearchPage })))

export const App: React.FC = () => (
    <BrowserRouter basename="/">
        <ScrollToTop />
        <Navbar />
        <React.Suspense fallback={<Timeout><PleaseWait /></Timeout>}>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/proteins" component={ProteinSearchPage} />
                <Route exact path="/proteins/:id" component={ProteinPage} />
                <Provider store={interactions}>
                    <Route exact path="/interactions" component={InteractionSearchPage} />
                    <Route exact path="/interactions/:id" component={InteractionPage} />
                </Provider>
            </Switch>
        </React.Suspense>
    </BrowserRouter>
)

const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation()

    useEffect(() => window.scrollTo(0, 0), [pathname])

    return null
}
