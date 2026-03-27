import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

export default function History() {

    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch (err) {
                console.log(err);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="container mt-4">

            {/* Top Bar */}
            <div className="d-flex align-items-center mb-4">
                <IconButton onClick={() => routeTo("/home")}>
                    <HomeIcon />
                </IconButton>
                <h4 className="ms-2 mb-0">Meeting History</h4>
            </div>

            {/* Cards */}
            <div className="row g-3">
                {meetings.length > 0 ? (
                    meetings.map((e, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h6 className="card-title text-primary">
                                        Meeting Code
                                    </h6>
                                    <p className="card-text">
                                        {e.meeting_code}
                                    </p>

                                    <h6 className="card-title text-secondary">
                                        Date
                                    </h6>
                                    <p className="card-text">
                                        {formatDate(e.date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted mt-5">
                        No meeting history found
                    </div>
                )}
            </div>
        </div>
    );
}