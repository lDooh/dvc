const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { OpenVidu } = require("openvidu-node-client");
require("dotenv").config();
const userModel = require("./src/models/userModel");
const roomModel = require("./src/models/roomModel");
const { updateCodeRules } = require("./src/realtimeDatabaseUtils");
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
const codeAuthority = {};

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

function endConference(uid) {
    roomModel.endConferenceByUid(uid, (err, results) => {
        if (err) {
            console.error("endConferenceByUid error: ", err);
        } else {
            if (results.affectedRows > 0) {
                // delete codeAuthority[uid];
                console.log(`호스트 ${uid}의 회의 종료`);
            }
        }
    });
}

async function findSocketByStreamId(roomId, streamId) {
    const sockets = await ioServer.sockets.in(roomId).fetchSockets();

    for (const socketId in sockets) {
        const socket = sockets[socketId];

        if (socket.streamId === streamId) {
            console.log("Success to find socket by streamId");

            return socket["uid"];
        }
    }

    console.log("Failed to find socket by streamId");
    return null;
}

const codeRules = {
    rules: {
        ".read": true,
        ".write": false,
    },
};

function initializeCodePermission(roomId) {
    if (codeRules["rules"][".write"] === false) {
        console.log("write 규칙 초기화");
        codeRules["rules"] = { ".read": true };
        codeRules["rules"]["codes"] = {};
    }

    if (!codeRules["rules"]["codes"][roomId]) {
        codeRules["rules"]["codes"][roomId] = {};
    }
}

/**
 * Retrurn authorized uids string.
 * @param {String} roomId
 * @returns authorized uids "(auth.uid === '123...' || auth.uid === ...)"
 */
function getAuthorizedUids(roomId) {
    let authorizedUids = "(";
    for (const uid of codeAuthority[roomId]) {
        authorizedUids += `auth.uid === '${uid}' || `;
    }
    authorizedUids = authorizedUids.substring(0, authorizedUids.length - 4);
    authorizedUids += ")";

    return authorizedUids;
}

function addCodePermission(roomId, newUid) {
    initializeCodePermission(roomId);

    codeAuthority[roomId].push(newUid);
    const authorizedUids = getAuthorizedUids(roomId);

    codeRules["rules"]["codes"][roomId][".write"] =
        "auth != null && " + authorizedUids;

    updateCodeRules(codeRules);
}

function removeCodePermission(roomId, deleteUid) {
    codeAuthority[roomId] = codeAuthority[roomId].filter(
        (uid) => uid != deleteUid
    );

    const authorizedUids = getAuthorizedUids(roomId);

    codeRules["rules"]["codes"][roomId][".write"] =
        "auth != null && " + authorizedUids;

    updateCodeRules(codeRules);
}

updateCodeRules(codeRules);

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
        roomModel.createRoom(uid, roomTitle, (err, results, newRoomId) => {
            if (err) {
                console.error("createRoom error: ", err);
                return;
            }
            socket.emit("createRoom", {
                room_id: newRoomId,
                uid: uid,
                room_title: roomTitle,
                inProgress: false,
            });
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

            socket.join(roomId);

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

    socket.on("roomChatRecord", (uid, roomId) => {
        // db
    });

    socket.on("sendRoomChat", (uid, roomId, msg) => {
        // db

        socket
            .to(roomId)
            .emit(
                "receiveRoomChat",
                uid,
                "닉네임",
                msg,
                getChattingDateStringByDate()
            );
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
                socket.hostingConference = roomId; // 해당 소켓이 호스트인 room의 roomId 저장
                codeAuthority[roomId] = [];
                addCodePermission(roomId, socket.uid); // 호스트는 실시간 코드 편집 권한을 가짐
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

    socket.on("streamId", (streamId) => {
        if (streamId) {
            socket["streamId"] = streamId;
            socket.emit("streamId", true);
            console.log("Successfully received streamId");
        } else {
            socket.emit("streamId", false);
            console.log("Failed to receive streamId");
        }
    });

    socket.on("authorize", async (roomId, streamId) => {
        const uid = await findSocketByStreamId(roomId, streamId);

        addCodePermission(roomId, uid);
    });

    socket.on("unauthorize", async (roomId, streamId) => {
        const uid = await findSocketByStreamId(roomId, streamId);

        removeCodePermission(roomId, uid);
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
