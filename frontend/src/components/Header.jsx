import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import webtubelogo from '../image/webtubelogo.jfif';

const Header2 = () => {


    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };



    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#006747' }} fixed-top>
            <div className="container">
                <NavLink className="navbar-brand" to="/">
                    <img src={webtubelogo} alt="WEBTUBE" className="brand-logo" />
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleNavbar}
                    aria-expanded={!collapsed ? true : false}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`${collapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                    <NavLink className="nav-link" to="/" onClick={() => setCollapsed(true)}> {/* Add this NavLink */}
                        <span className="navbar-title">THE DLSAU WEB-TUBE</span> {/* Use a span element */}
                    </NavLink>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/Balitaraneta">BalitAraneta</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/animo-idol">Animo Idol</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/animo-in-demand">Animo In-Demand</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/lassalian-tambayan">Lasallian Tambayan</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/proud-lasallian">Proud Lasallian</NavLink>
                        </li>
                         <li className="nav-item">
                            <NavLink className="nav-link" to="/info-talk">The DLSAU InfoTalk</NavLink>
                        </li>
                         <li className="nav-item">
                            <NavLink className="nav-link" to="/testimonials">The DLSAU Testimonials</NavLink>
                        </li>
                         <li className="nav-item">
                            <NavLink className="nav-link" to="/galing-araneta">Galing Araneta, Galing Araneta</NavLink>
                        </li>
                         <li className="nav-item">
                            <NavLink className="nav-link" to="/animo-model">Animo Model</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header2;
