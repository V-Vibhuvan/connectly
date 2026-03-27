import React, { useContext, useState } from 'react';
import {AuthContext} from "../contexts/AuthContext";
import { TextField, Button, Snackbar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Authentication() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: ""
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [formState, setFormState] = useState(0);
    const [open, setOpen] = useState(false);

    const {handleRegister, handleLogin} = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };

    const handleAuth = async () => {
        try {
            if(formState === 0){
                await handleLogin(formData.username, formData.password);
            }
            if(formState === 1){
                let result = await handleRegister(
                    formData.name,
                    formData.username,
                    formData.password
                );

                setFormData({username: "", password: "", name: ""});
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0);
            } 
        } catch (err) {
            let msg = err.response?.data?.message || "Something went wrong";
            setError(msg);
        }
    };

    return (
        <div 
            className='container-fluid vh-100 d-flex justify-content-center align-items-center'
            style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)"
            }}
        >
            <div className='row w-100 justify-content-center align-items-center'>
                
                {/* CENTERED FORM */}
                <div className='col-11 col-sm-8 col-md-5 col-lg-4 d-flex justify-content-center'>
                    
                    <div 
                        className='p-4 bg-white rounded shadow-lg'
                        style={{
                            width: "100%",
                            maxWidth: "400px"
                        }}
                    >

                        {/* Header */}
                        <div className='text-center mb-4'>
                            <div 
                                className="d-inline-flex justify-content-center align-items-center rounded-circle mb-2"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    backgroundColor: "#667eea",
                                    color: "white"
                                }}
                            >
                                <LockOutlinedIcon />
                            </div>
                            <h4 className='fw-bold'>Smile Video Call</h4>
                            <p className="text-muted small">Connect instantly with anyone</p>
                        </div>

                        {/* Toggle Buttons */}
                        <div className="d-flex justify-content-center mb-3">
                            <div className="btn-group w-100">
                                <button 
                                    className={`btn ${formState === 0 ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setFormState(0)}
                                >
                                    Sign In
                                </button>

                                <button
                                    className={`btn ${formState === 1 ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setFormState(1)}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <div className='d-flex flex-column gap-3'>
                            {formState === 1 && (
                                <TextField
                                    name="name"
                                    label="Full Name"
                                    fullWidth
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            )}

                            <TextField
                                name="username"
                                label="Username"
                                fullWidth
                                value={formData.username}
                                onChange={handleChange}
                            />

                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                fullWidth
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <p className="text-danger mt-2 text-center">{error}</p>
                        )}

                        {/* Button */}
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                backgroundColor: "#667eea",
                                '&:hover': { backgroundColor: "#5a67d8" }
                            }}
                            onClick={handleAuth}
                        >
                            {formState === 0 ? "Login" : "Register"}
                        </Button>

                    </div>
                </div> 
            </div>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={message}
            />
        </div>
    );
}