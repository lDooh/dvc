import { useEffect, useState } from "react";
import { authService } from "../firebaseInstance";
import AppRouter from "./AppRouter";

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

    return (
        <>
            <header>Header</header>
            {init ? (
                <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
            ) : (
                "로딩중"
            )}
        </>
    );
}

export default App;
