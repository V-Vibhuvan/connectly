import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/users`
});

export const AuthProvider = ({ children }) => {

    const [userData, setUserData] = useState(null);

    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {

            const request = await client.post("/register", {
                name,
                username,
                password
            });

            if (request.status === 200) {   
                return request.data.message;
            }

        } catch (err) {
            return err.response?.data?.message || "Something went wrong"
        }
    };


    const handleLogin = async (username, password) => {
        try {

            const request = await client.post("/login", {
                username,
                password
            });

            if (request.status === 200) {   // OK
                localStorage.setItem("token", request.data.token);
                localStorage.setItem("username", username);
                router("/home");
            }

        } catch (err) {
            throw err;
        }
    };


    const getHistoryOfUser = async () => {
        try {

            const request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });

            return request.data;

        } catch (err) {
            throw err;
        }
    };


    const addToUserHistory = async (meetingCode) => {
        try {

            const request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });

            return request;

        } catch (err) {
            return err.response?.data?.message || "Login Failed";
        }
    };


    const data = {
        userData,
        setUserData,
        addToUserHistory,
        getHistoryOfUser,
        handleRegister,
        handleLogin
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};