import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">Unauthorized Access</h3>
                            <p className="card-text">
                                You are not authorized to access this page. Please login with appropriate credentials.
                            </p>
                            <Link to="/login" className="btn btn-primary">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Unauthorized;
