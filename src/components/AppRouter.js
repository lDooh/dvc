import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import LoginPage from "../routes/LoginPage";
import Home from "../routes/Home";

function AppRouter({ isLoggedIn, userObj, frontSocket }) {
    return (
        <Router>
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route
                            exact
                            path="/"
                            element={
                                <Home
                                    frontSocket={frontSocket}
                                    userObj={userObj}
                                ></Home>
                            }
                        />
                    </>
                ) : (
                    <Route
                        exact
                        path="/"
                        element={
                            <LoginPage frontSocket={frontSocket}></LoginPage>
                        }
                    />
                )}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
