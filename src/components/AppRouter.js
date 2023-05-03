import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigage,
    Navigate,
} from "react-router-dom";
import LoginPage from "../routes/LoginPage";
import Home from "../routes/Home";

function AppRouter({ isLoggedIn, userObj }) {
    return (
        <Router>
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route
                            exact
                            path="/"
                            element={<Home userObj={userObj}></Home>}
                        />
                    </>
                ) : (
                    <Route exact path="/" element={<LoginPage></LoginPage>} />
                )}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
