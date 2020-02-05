import React from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { store } from 'app'
import { Navbar, PageLoader } from 'app/partials'

const HomePage = React.lazy(() => import('app/home').then(module => ({ default: module.HomePage })))
const SearchPage = React.lazy(() => import('app/search').then(module => ({ default: module.SearchPage })))

export const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Navbar />
                <React.Suspense fallback={<PageLoader />}>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/interactions" component={SearchPage} />
                    </Switch>
                </React.Suspense>
            </BrowserRouter>
        </Provider>
    );
}
