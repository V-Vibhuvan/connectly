import React from 'react'
import { Link } from 'react-router-dom'
import Logo from "../assets/connectly.png";

export default function LandingPage() {

    return (
        <div className="container-fluid p-0">

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
                <div className="container-fluid">

                    <h2 className="navbar-brand fw-bold">
                        Connectly
                    </h2>

                    <div className="d-flex gap-4 align-items-center">

                        <Link className="nav-link" to={`/${Math.random().toString(36).substring(2,8)}`}>
                            Join as Guest
                        </Link>

                        <Link className="nav-link" to="/auth">
                            Register
                        </Link>

                        <Link className="btn btn-primary" to="/auth">
                            Login
                        </Link>

                    </div>

                </div>
            </nav>


            {/* Main Section */}
            <div className="container mt-5">
                <div className="row align-items-center">

                    {/* Left Side */}
                    <div className="col-md-6">

                        <h1 className="fw-bold">
                            <span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones
                        </h1>

                        <p className="text-muted mt-3">
                            Cover a distance by Connectly
                        </p>

                        <Link to="/auth" className="btn btn-warning mt-3">
                            Get Started
                        </Link>

                    </div>

                    {/* Right Side */}
                    <div className="col-md-6 text-center">
                        <img
                            src={ Logo }
                            alt="video-call"
                            className="img-fluid"
                            style={{ maxHeight: "500px" }}
                        />
                    </div>

                </div>
            </div>

        </div>
    )
}