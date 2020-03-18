import React from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { store } from 'app'
import { Navbar, PageLoader } from 'pages/partials'

const HomePage = React.lazy(() => import('pages/home').then(module => ({ default: module.HomePage })))
const InteractionSearchPage = React.lazy(() => import('pages/interactions').then(module => ({ default: module.InteractionSearchPage })))

export const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter basename="/">
                <Navbar />
                <React.Suspense fallback={<PageLoader />}>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/interactions" component={InteractionSearchPage} />
                    </Switch>
                </React.Suspense>
            </BrowserRouter>
        </Provider>
    );
}
