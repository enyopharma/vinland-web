import React from 'react';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Navbar } from './app/Navbar'
import { HomePage } from './app/HomePage'
import { SearchPage } from './app/search/SearchPage';

const reducer = combineReducers({})

const store = createStore(reducer)

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/interactions" component={SearchPage} />
                </Switch>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
