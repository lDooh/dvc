const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();
const userModel = require("./src/models/userModel");
const roomModel = require("./src/models/roomModel");
const { REPL_MODE_SLOPPY } = require("repl");

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
            console.log("createRoom results: ", results);
        });
    });

    socket.on("getRooms", (uid) => {
        roomModel.getRoomByUid(uid, (err, results) => {
            if (err) {
                console.error("getRooms error: ", err);
                return;
            }
        });
        socket.emit("getRooms", result);
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
