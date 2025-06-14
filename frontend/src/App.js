import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import AddUserComponent from './components/AddUserComponent';
import ViewUserComponent from './components/ViewUserComponent';
import AddNewsForm from './components/AddNewsForm';
import ListNewsComponent from "./components/ListNewsComponent";
import ViewNewsDetailsForm from './components/ViewNewsDetailsForm';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Unauthorized from './components/Unauthorized';
import NotificationComponent from './components/NotificationComponent';
import ListUserComponent from './components/ListUserComponent';
import ManagePendingNewsComponent from './components/ManagePendingNewsComponent';
import MyNewsListComponent from './components/MyNewsListComponent'
import ListCommentComponent from './components/ListCommentComponent '
import axios from 'axios';
import ReadOnlyNewsDetails from './components/ReadOnlyNewsDetails';
// import sendRawContentComponent from './components/sendRawContentComponent'
import ContributeContentForm from './components/ContributeContentForm'
import ReadContributedNewsDetailsForm from './components/ReadContributedNewsDetailsForm';
import ListContributedNewsComponent from './components/ListContributedNewsComponent';
import AddNewsFormWithAI from './components/AddNewsFormWithAI';

import Balitaraneta from './components/Balitaraneta';
import AnimoIdol from './components/Animo-Idol';
import InfoTalk from './components/InfoTalk';
import GalingAraneta from './components/Galing-Araneta';
import LasallianTambayan from './components/Lasallian-Tambayan';
import AniModel from './components/AniModel';
import ProudLasallian from './components/Proud-Lasallian';
import AnimoIndemand from './components/Animo-In-Demand';
import Testimonial from './components/Testimonial';
function App() {
    const [authenticated, setAuthenticated] = useState(null);
    const [role, setRole] = useState('');

    // Load token and role from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');
        console.log("Token from localStorage:", token); // Debugging
        console.log("Role from localStorage:", userRole); // Debugging

        if (token && userRole) {
            setAuthenticated(true);
            setRole(userRole.trim().toUpperCase()); // Normalize role
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            setAuthenticated(false);
        }
    }, []);

    // Handle login
    function handleLogin(token, userRole) {
        console.log("Logging in with role:", userRole); // Debugging
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole);
        setAuthenticated(true);
        setRole(userRole.trim().toUpperCase()); // Normalize role
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Loading screen
    if (authenticated === null) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div>
                <Switch>
                    {/* Public Endpoints */}
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/comments" component={ListCommentComponent} />
                    <Route exact path="/balitaraneta" component={Balitaraneta} />
                    <Route exact path="/animo-idol" component={AnimoIdol} />
                    <Route exact path="/testimonials" component={Testimonial} />
                    <Route exact path="/info-talk" component={InfoTalk} />
                    <Route exact path="/galing-araneta" component={GalingAraneta} />
                    <Route exact path="/lassalian-tambayan" component={LasallianTambayan} />
                    <Route exact path="/animo-model" component={AniModel} />
                    <Route exact path="/proud-lasallian" component={ProudLasallian} />
                    <Route exact path="/animo-in-demand" component={AnimoIndemand} />

                    <Route path="/login" render={() => <Login onLogin={handleLogin} />} />
                    <Route path="/view-news/:id" component={ViewNewsDetailsForm} />
                    <Route path="/read-news/:id" component={ReadOnlyNewsDetails} />
                    <Route path="/ContributeContent" component={ContributeContentForm} />
                    <Route path="/ReadContributeContent/:id" component={ReadContributedNewsDetailsForm} />
                    <Route path="/ListContributeContent" component={ListContributedNewsComponent} />



                    {/* Protected Routes */}
                    {authenticated ? (
                        <>
                            {/* Shared Routes for Both ADMIN and AUTHOR */}
                            {(role === 'AUTHOR' || role === 'ADMIN') && (
                                <>
                                    <Route path="/my-news" component={MyNewsListComponent} />
                                    <Route path="/news" component={ListNewsComponent} />
                                    <Route path="/news-management" component={ListNewsComponent} />
                                    <Route path="/notification" component={NotificationComponent} />
                                    <Route path="/add-news/:id" component={AddNewsForm} />
                                    <Route path="/add-news-withAI/:id" component={AddNewsFormWithAI} />
                                    <Route path="/pending-news" component={ManagePendingNewsComponent} />
                                </>
                            )}

                            {/* Admin-Only Routes */}
                            {role === 'ADMIN' && (
                                <>
                                    <Route path="/add-user/:id" component={AddUserComponent} />
                                    <Route path="/view-user/:id" component={ViewUserComponent} />
                                    <Route path="/user-management" component={ListUserComponent} />
                                    <Route path="/comments-management" exact component={ListCommentComponent} />
                                </>
                            )}
                        </>
                    ) : role ? (
                        <Redirect to="/unauthorized" />
                    ) : (
                        <Redirect to="/login" />
                    )}

                    {/* Unauthorized Route */}
                    <Route path="/unauthorized" component={Unauthorized} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
