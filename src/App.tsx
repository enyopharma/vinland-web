import React from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { store } from 'app/store'
import { Navbar } from 'app/components/Navbar'
import { PageLoader } from 'app/components/PageLoader'

const HomePage = React.lazy(() => import('home/components/HomePage').then(module => ({ default: module.HomePage })))
const SearchPage = React.lazy(() => import('search/components/SearchPage').then(module => ({ default: module.SearchPage })))

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
