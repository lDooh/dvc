const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { OpenVidu } = require("openvidu-node-client");
require("dotenv").config();
const userModel = require("./src/models/userModel");
const roomModel = require("./src/models/roomModel");
const { updateDatabaseRules } = require("./src/realtimeDatabaseUtils");
const app = express();

/**
 * before server start
 * docker run -p 4443:4443 --rm -e openvidu.secret=MY_SECRET -e openvidu.publicurl=https://localhost:4443 openvidu/openvidu-server-kms
 */

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

function getChattingDateString(before) {
    const year = before.getFullYear();
    const month = String(before.getMonth() + 1).padStart(2, "0");
    const day = String(before.getDate()).padStart(2, "0");
    let hour = before.getHours();
    const minute = String(before.getMinutes()).padStart(2, "0");

    let period = "오전";
    if (hour >= 12) {
        period = "오후";
        hour -= 12;
    }

    const afterDate = `${year}/${month}/${day} ${period} ${hour}:${minute}`;
    return afterDate;
}

function getChattingDateStringByDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    let hour = currentDate.getHours();
    const minute = String(currentDate.getMinutes()).padStart(2, "0");

    let period = "오전";
    if (hour >= 12) {
        period = "오후";
        hour -= 12;
    }

    const formattedDate = `${year}/${month}/${day} ${period} ${hour}:${minute}`;
    return formattedDate;
}

// for test
const newRules = {
    rules: {
        ".read": true,
        ".write": false,
    },
};

updateDatabaseRules(newRules);

function endConference(uid) {
    roomModel.endConferenceByUid(uid, (err, results) => {
        if (err) {
            console.error("endConferenceByUid error: ", err);
        } else {
            console.log(`호스트 ${uid}의 회의 종료`);
        }
    });
}

ioServer.on("connection", (socket) => {
    console.log("연결");

    socket.on("login", (uid) => {
        socket.uid = uid;
    });

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
                socket.join(roomId);
                isStart = true;
            }

            socket.emit("startConference", isStart);
        });
    });

    socket.on("joinConference", async (uid, roomId) => {
        socket.join(roomId);

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

    socket.on("sendRealtimeChat", (uid, roomId, msg) => {
        userModel.findUserByUid(uid, (err, results) => {
            if (err) {
                console.error("findUserByUid error: ", err);
            }

            socket
                .to(roomId)
                .emit(
                    "receiveRealtimeChat",
                    uid,
                    results[0].nickname,
                    msg,
                    getChattingDateStringByDate()
                );
        });
    });

    socket.on("logout", () => {
        const uid = socket.uid;
        console.log(`로그아웃: ${uid}`);
        endConference(uid);
        socket.uid = null;
    });

    socket.on("endConference", () => {
        const uid = socket.uid;
        console.log(`회의 종료: ${uid}`);
        endConference(uid);
    });

    socket.on("disconnecting", () => {
        // 연결이 끊긴 소켓이 로그인한 상태였고, 회의의 호스트라면 회의 종료
        if (socket.uid) {
            const uid = socket.uid ? socket.uid : null;
            endConference(uid);
        }
        console.log("연결 끊김");
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
