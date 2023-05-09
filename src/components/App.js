import { useEffect, useState } from "react";
import { authService } from "../firebaseInstance";
import AppRouter from "./AppRouter";
import { io } from "socket.io-client";

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
    const [userObj, setUsetObj] = useState(null);
    const [frontSocket, setFrontSocket] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
                setUsetObj(user);
            } else {
                setIsLoggedIn(false);
            }

            setInit(true);
        });
    }, []);

    useEffect(() => {
        const newSocket = io();

        const checkSocket = setInterval(() => {
            if (newSocket) {
                console.log("Socket connected!");
                newSocket.on("nickname", async (nickname) => {
                    await authService.currentUser.updateProfile({
                        displayName: nickname,
                    });
                    window.location.reload();
                });

                setFrontSocket(newSocket);

                clearInterval(checkSocket);
            }
        }, 100);

        return () => {
            console.log("Close socket.");
            newSocket.disconnect();
        };
    }, []);

    return (
        <>
            <header>Header</header>
            {frontSocket && init ? (
                <AppRouter
                    isLoggedIn={isLoggedIn}
                    userObj={userObj}
                    frontSocket={frontSocket}
                />
            ) : (
                "로딩중"
            )}
        </>
    );
}

export default App;
