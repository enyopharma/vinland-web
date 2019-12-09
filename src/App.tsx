import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Navbar } from './components/Navbar'
import { HomePage } from './components/HomePage'
import { SearchPage } from './components/SearchPage';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route path="/interactions">
                        <SearchPage />
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
