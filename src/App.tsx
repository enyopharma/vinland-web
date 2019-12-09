import React from 'react';
import 'bootstrap/js/dist/collapse';

const App: React.FC = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                <div className="container">
                    <a className="navbar-brand" href="/">Vinland</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navcontent">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div id="navcontent" className="collapse navbar-collapse">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container">
            </div>
        </div>
    );
}

export default App;
