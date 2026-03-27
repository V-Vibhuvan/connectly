const { Server } = require("socket.io");

let connections = {};
let messages = {};
let timeOnline = {};

module.exports.connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // JOIN CALL
        socket.on("join-call", (path) => {
            if (connections[path] === undefined) {
                connections[path] = [];
            }

            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            connections[path].forEach((id) => {
                io.to(id).emit("user-joined", socket.id, connections[path]);
            });

            // Send old messages
            if (messages[path] !== undefined) {
                messages[path].forEach((msg) => {
                    io.to(socket.id).emit(
                        "chat-message",
                        msg.data,
                        msg.sender,
                        msg["socket-id-sender"]
                    );
                });
            }
        });

        // SIGNAL (WebRTC)
        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        // CHAT
        socket.on("chat-message", (data, sender) => {
            const [room, found] = Object.entries(connections)
                .reduce(([r, isFound], [key, value]) => {
                    if (!isFound && value.includes(socket.id)) {
                        return [key, true];
                    }
                    return [r, isFound];
                }, ["", false]);

            if (found) {
                if (!messages[room]) {
                    messages[room] = [];
                }

                messages[room].push({
                    sender: sender,
                    data: data,
                    "socket-id-sender": socket.id
                });

                console.log(`Message in ${room}: ${sender} -> ${data}`);

                connections[room].forEach((id) => {
                    io.to(id).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        // DISCONNECT
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);

            let key = null;

            for (const [k, v] of Object.entries(connections)) {
                if (v.includes(socket.id)) {
                    key = k;
                    break;
                }
            }

            if (key && connections[key]) {
                connections[key].forEach((id) => {
                    io.to(id).emit("user-left", socket.id);
                });

                let index = connections[key].indexOf(socket.id);
                if (index !== -1) {
                    connections[key].splice(index, 1);
                }

                // cleanup
                if (connections[key].length === 0) {
                    delete connections[key];
                    delete messages[key]; // prevent memory leak
                }
            }
        });
    });

    return io;
};