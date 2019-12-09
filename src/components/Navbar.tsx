import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/js/dist/collapse'

const Navbar: React.FC = () => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
            <Link className="navbar-brand" to="/">Vinland</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navcontent">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div id="navcontent" className="collapse navbar-collapse">
                <ul className="navbar-nav">
                    <li>
                        <Link className="nav-link" to="/interactions">Search interactions</Link>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Contact</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
)

export { Navbar }
