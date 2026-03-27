import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Logo from "../assets/connectly.png";

function HomeComponent() {

  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    if(!meetingCode.trim()) return;
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
        <div className="container-fluid">

          <span className="navbar-brand fw-bold">
            Connectly
          </span>

          <div className="d-flex align-items-center gap-3">

            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/history")}
            >
              History
            </button>

            <button
              className="btn btn-danger"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth");
              }}
            >
              Logout
            </button>

          </div>

        </div>
      </nav>


      {/* Main Section */}
      <div className="container mt-5">

        <div className="row align-items-center">

          {/* Left Panel */}
          <div className="col-md-6">
            <div className="p-4 shadow rounded bg-white">
              <h2 className="fw-bold mb-4">
                Providing Quality Video Call Just Like Quality Education
              </h2>

              <div className="input-group">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Meeting Code"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                />

                <button
                  className="btn btn-primary"
                  onClick={handleJoinVideoCall}
                >
                  Join
                </button>

              </div>
            </div>
          </div>


          {/* Right Panel */}
          <div className="col-md-6 text-center">

            <img
              src= {Logo}
              alt="video-call"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "400px" }}
            />

          </div>
        </div>
      </div>

    </>
  );
}

export default withAuth(HomeComponent);