import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeet() {

    let socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();
    const videoRef = useRef([])

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    let [videos, setVideos] = useState([])

    const { addToUserHistory } = useContext(AuthContext);


    useEffect(() => {
        console.log("HELLO")
        getPermissions();
    },[]);

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { console.log(stream); })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }
    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }


    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }
    
    let connect = async () => {
        setAskForUsername(false);
        const meetingCode = window.location.pathname;
        await addToUserHistory(meetingCode);
        getMedia();
    }

    return (
        <div className="container-fluid p-3">

            {askForUsername ? (

            /* LOBBY */
            <div className="d-flex flex-column align-items-center justify-content-center vh-100">

                <div className="card p-4 shadow text-center" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="mb-3">Enter Lobby</h3>

                <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />

                <Button className="mt-3" variant="contained" onClick={connect}>
                    Connect
                </Button>
                </div>

                <video
                ref={localVideoref}
                autoPlay
                muted
                className="mt-4 rounded shadow"
                style={{ width: "300px" }}
                />

            </div>

            ) : (

            /* VIDEO MEET */
            <div className="row">

                {/* CHAT SIDEBAR */}
                {showModal && (
                <div 
                    className="col-md-3 d-flex flex-column vh-100"
                    style={{
                        background: "#f8f9fa",
                        borderLeft: "1px solid #ddd"
                    }}
                >

                    {/* HEADER */}
                    <div 
                        className="p-3 text-white"
                        style={{
                            background: "#667eea",
                            fontWeight: "bold"
                        }}
                    >
                        Chat
                    </div>

                    {/* MESSAGES */}
                    <div 
                        className="flex-grow-1 p-3"
                        style={{
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}
                    >
                        {messages.length > 0 ? messages.map((item, index) => {

                            const isMe = item.sender === username;

                            return (
                                <div 
                                    key={index}
                                    style={{
                                        alignSelf: isMe ? "flex-end" : "flex-start",
                                        maxWidth: "75%"
                                    }}
                                >
                                    <div
                                        style={{
                                            background: isMe ? "#667eea" : "#e4e6eb",
                                            color: isMe ? "white" : "black",
                                            padding: "8px 12px",
                                            borderRadius: "12px",
                                            fontSize: "14px"
                                        }}
                                    >
                                        {!isMe && (
                                            <div style={{ fontSize: "11px", fontWeight: "bold" }}>
                                                {item.sender}
                                            </div>
                                        )}
                                        {item.data}
                                    </div>
                                </div>
                            );
                        }) : (
                            <p className="text-muted text-center mt-3">No Messages Yet</p>
                        )}
                    </div>

                    {/* INPUT AREA */}
                    <div 
                        className="p-2 d-flex gap-2"
                        style={{
                            borderTop: "1px solid #ddd",
                            background: "#fff"
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                        />

                        <Button 
                            variant="contained" 
                            onClick={sendMessage}
                            style={{ background: "#667eea" }}
                        >
                            Send
                        </Button>
                    </div>

                </div>
                )}

                {/* VIDEO AREA */}
                <div className={showModal ? "col-md-9" : "col-12"}>

                {/* LOCAL VIDEO */}
                <div className="text-center mb-3">
                    <video
                    ref={localVideoref}
                    autoPlay
                    muted
                    className="rounded shadow"
                    style={{ maxWidth: "600px",minHeight:"auto", height: "auto" }}
                    />
                </div>

                {/* REMOTE VIDEOS */}
                <div className="row g-3">
                    {videos.map((video) => (
                    <div className="col-md-4" key={video.socketId}>
                        <video
                        className="w-100 rounded shadow"
                        ref={ref => {
                            if (ref && video.stream) {
                            ref.srcObject = video.stream;
                            }
                        }}
                        autoPlay
                        />
                    </div>
                    ))}
                </div>

                {/* CONTROLS */}
                <div className="d-flex justify-content-center gap-3 mt-4">

                    <IconButton onClick={handleVideo} className="bg-light">
                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                    </IconButton>

                    <IconButton onClick={handleAudio} className="bg-light">
                    {audio ? <MicIcon /> : <MicOffIcon />}
                    </IconButton>

                    <IconButton onClick={handleEndCall} className="bg-danger text-white">
                    <CallEndIcon />
                    </IconButton>

                    {screenAvailable && (
                    <IconButton onClick={handleScreen} className="bg-light">
                        {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                    </IconButton>
                    )}

                    <Badge badgeContent={newMessages} color="primary">
                    <IconButton onClick={() => setModal(!showModal)} className="bg-light">
                        <ChatIcon />
                    </IconButton>
                    </Badge>

                </div>

                </div>

            </div>

            )}

        </div>
    );
}