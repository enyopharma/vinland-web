import React, { useEffect } from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';

import { store } from 'app/store'
import { Navbar, Timeout, PleaseWait } from 'partials'

const HomePage = React.lazy(() => import('pages').then(module => ({ default: module.HomePage })))
const ProteinPage = React.lazy(() => import('pages').then(module => ({ default: module.ProteinPage })))
const ProteinSearchPage = React.lazy(() => import('pages').then(module => ({ default: module.ProteinSearchPage })))
const InteractionPage = React.lazy(() => import('pages').then(module => ({ default: module.InteractionPage })))
const InteractionSearchPage = React.lazy(() => import('form').then(module => ({ default: module.InteractionSearchPage })))

export const App: React.FC = () => (
    <Provider store={store}>
        <BrowserRouter basename="/">
            <ScrollToTop />
            <Navbar />
            <React.Suspense fallback={<Timeout><PleaseWait /></Timeout>}>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/proteins" component={ProteinSearchPage} />
                    <Route exact path="/proteins/:id" component={ProteinPage} />
                    <Route exact path="/interactions" component={InteractionSearchPage} />
                    <Route exact path="/interactions/:id" component={InteractionPage} />
                </Switch>
            </React.Suspense>
        </BrowserRouter>
    </Provider>
)

const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation()

    useEffect(() => window.scrollTo(0, 0), [pathname])

    return null
}
