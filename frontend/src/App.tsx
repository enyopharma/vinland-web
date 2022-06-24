import React, { useEffect } from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route, Link, useHistory, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

import { store } from 'app/store'
import { Timeout, Dots } from 'partials'

ReactGA.initialize('G-13D60DCHDX')

const HomePage = React.lazy(() => import('pages').then(module => ({ default: module.HomePage })))
const ProteinPage = React.lazy(() => import('pages').then(module => ({ default: module.ProteinPage })))
const ProteinSearchPage = React.lazy(() => import('pages').then(module => ({ default: module.ProteinSearchPage })))
const InteractionPage = React.lazy(() => import('pages').then(module => ({ default: module.InteractionPage })))
const InteractionSearchPage = React.lazy(() => import('form').then(module => ({ default: module.InteractionSearchPage })))

export const App: React.FC = () => (
    <Provider store={store}>
        <BrowserRouter basename="/">
            <TrackPath />
            <ScrollToTop />
            <Navbar />
            <React.Suspense fallback={<Fallback />}>
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

const TrackPath: React.FC = () => {
    const { pathname } = useLocation()

    useEffect(() => { ReactGA.pageview(pathname) }, [pathname])

    return null
}

const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation()

    useEffect(() => { window.scrollTo(0, 0) }, [pathname])

    return null
}

const Fallback: React.FC = () => (
    <Timeout>
        <div className="container">
            <div className="text-center">
                Please wait <Dots />
            </div>
        </div>
    </Timeout>
)

const Navbar: React.FC = () => {
    const history = useHistory()
    const { pathname } = useLocation()

    const handleContactClick = () => {
        if (pathname === '/') {
            document.getElementById('contact')?.scrollIntoView()
            return
        }

        history.push('/#contact')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">Vinland</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navcontent">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="navcontent" className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li>
                            <Link className="nav-link" to="/proteins">
                                Proteins
                            </Link>
                        </li>
                        <li>
                            <Link className="nav-link" to="/interactions">
                                Interactions
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <button className="nav-link btn-contact" onClick={() => { handleContactClick() }}>
                                Contact
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
