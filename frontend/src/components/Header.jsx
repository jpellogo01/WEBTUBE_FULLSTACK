import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import webtubelogo from '../image/webtubelogo.jfif';

const Header2 = () => {
    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    const menuItems = [
        { to: "/Balitaraneta", label: "BalitAraneta" },
        { to: "/animo-idol", label: "Animo Idol" },
        { to: "/animo-in-demand", label: "Animo InDemand" },
        { to: "/lassalian-tambayan", label: "Lasallian Tambayan" },
        { to: "/proud-lasallian", label: "Proud Lasallian" },
        { to: "/info-talk", label: "DLSAU InfoTalk" },
        { to: "/testimonials", label: "The DLSAU Testimonials" },
        { to: "/galing-araneta", label: "Galing Araneta" },
        { to: "/animo-model", label: "Animo Model" }
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: '#006747' }}>
            <div className="container">
                <NavLink className="navbar-brand" to="/">
                    <img src={webtubelogo} alt="WEBTUBE" className="brand-logo" />
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleNavbar}
                    aria-expanded={!collapsed}
                >
                    <div className={`custom-toggler ${!collapsed ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>

                <div className={`${collapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                    <NavLink className="nav-link text-white w-100 text-center mb-2" to="/" onClick={() => setCollapsed(true)}>
                        <span className="navbar-title">THE DLSAU WEB-TUBE</span>
                    </NavLink>

                    <ul className="navbar-nav nav-two-rows">
                        {menuItems.map((item, idx) => (
                            <li className="nav-item" key={idx}>
                                <NavLink className="nav-link small-nav-link" to={item.to} onClick={() => setCollapsed(true)}>
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header2;
