import { useEffect, useState } from "react";
import { authService } from "../firebaseInstance";
import AppRouter from "./AppRouter";
import { SocketContext, frontSocket } from "../context/clientSocket";

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
    const [userObj, setUsetObj] = useState(null);

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

    frontSocket.on("nickname", async (nickname) => {
        await authService.currentUser.updateProfile({ displayName: nickname });
        window.location.reload();
    });

    return (
        <SocketContext.Provider value={frontSocket}>
            <div>
                {/* <header>Header</header> */}
                {init ? (
                    <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
                ) : (
                    "로딩중"
                )}
            </div>
        </SocketContext.Provider>
    );
}

export default App;
