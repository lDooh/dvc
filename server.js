const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

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

// for test
const userModel = require("./src/models/userModel");
userModel.getAllUsers((err, results) => {
    if (err) {
        console.error("getAllUser error: ", err);
    }
    console.log(results);
});
