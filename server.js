const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { OpenVidu } = require("openvidu-node-client");
require("dotenv").config();
const userModel = require("./src/models/userModel");
const roomModel = require("./src/models/roomModel");
const app = express();

app.use(express.static(path.join(__dirname, "/build")));
app.get("/", (res, req) => {
    req.sendFile(path.join(__dirname, "/build/index.html"));
});
app.get("*", (res, req) => {
    req.sendFile(path.join(__dirname, "/build/index.html"));
});

const httpServer = http.createServer(app);
const ioServer = new Server(httpServer);

const openViduUrl = "http://localhost:4443";
const openViduSecret = "MY_SECRET";
const openvidu = new OpenVidu(openViduUrl, openViduSecret);
const sessions = {};

ioServer.on("connection", (socket) => {
    console.log("연결");

    socket.on("socialLogin", (uid) => {
        userModel.findUserByUid(uid, (err, results) => {
            if (err) {
                console.error("findUserByUid error: ", err);
                return;
            }

            // signup
            if (results.length == 0) {
                userModel.signUpUser(uid, "", "", (err, nickname, results) => {
                    if (err) {
                        console.error("signUpUser error: ", err);
                        return;
                    }
                    // Emit newly created nickname
                    socket.emit("nickname", nickname);
                });
            }
        });
    });

    socket.on("emailSignUp", (uid, password, nickname) => {
        userModel.signUpUser(uid, password, nickname, (err, nick, results) => {
            if (err) {
                if (err) {
                    console.error("signUpUser error: ", err);
                }
            }
            socket.emit("nickname", nickname);
        });
    });

    socket.on("createRoom", (uid, roomTitle) => {
        roomModel.createRoom(uid, roomTitle, (err, results) => {
            if (err) {
                console.error("createRoom error: ", err);
                return;
            }
        });
    });

    socket.on("getRooms", (uid) => {
        roomModel.getRoomByUid(uid, (err, results) => {
            if (err) {
                console.error("getRooms error: ", err);
                return;
            }
            socket.emit("getRooms", results);
        });
    });

    socket.on("roomTitle", (roomId, uid) => {
        roomModel.getRoomByRoomId(roomId, (err, results) => {
            if (err) {
                console.error("getRoomByRoomId error: ", err);
                return;
            }

            socket.emit(
                "roomTitle",
                results[0].room_title,
                uid == results[0].uid
            );
        });
    });

    socket.on("roomInfo", (roomId, uid) => {
        roomModel.getRoomByRoomId(roomId, (err, results) => {
            if (err) {
                console.error("getRoomByRoomId error: ", err);
                return;
            }

            socket.emit(
                "roomInfo",
                results[0].room_title,
                uid == results[0].uid,
                results[0].inProgress
            );
        });
    });

    socket.on("startConference", (roomId) => {
        let isStart = false;

        roomModel.startConference(roomId, (err, results) => {
            if (err) {
                console.error("startConference error: ", err);
                isStart = false;
            } else {
                isStart = true;
            }

            socket.emit("startConference", isStart);
        });
    });

    socket.on("joinConference", async (uid, roomId) => {
        // Create session if not exist
        if (!sessions[roomId]) {
            ovProperties = {};

            try {
                const createdSession = await openvidu.createSession(
                    ovProperties
                );
                sessions[roomId] = createdSession;
            } catch (err) {
                console.error("세션 생성 실패: ", err);
            }
        }

        const session = sessions[roomId];
        const connectionProperties = {
            role: "PUBLISHER",
            data: JSON.stringify({ socketId: socket.id, uid: uid }),
        };
        const connection = await session.createConnection(connectionProperties);
        const token = connection.token;
        socket.emit("token", token, session.sessionId);
    });
});

const serverUrl = "http://localhost";
const port = 3000;
const handleListen = () => {
    console.log(`Listening on ${serverUrl}:${port}`);
};

process.once("SIGINT", () => {
    console.log("Shutdown server.");
    process.exit();
});

httpServer.listen(3000, handleListen);
