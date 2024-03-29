import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import LoginPage from "../routes/LoginPage";
import Home from "../routes/Home";
import Room from "../routes/Room";
import VideoRoom from "../routes/VideoRoom";
import Invitation from "../routes/Invitation";

function AppRouter({ isLoggedIn, userObj }) {
    return (
        <Router>
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route
                            exact
                            path="/"
                            element={<Home userObj={userObj} />}
                        />
                        <Route
                            exact
                            path="/invitation/:roomid"
                            element={<Invitation userObj={userObj} />}
                        />
                        <Route
                            exact
                            path="/room/:roomid"
                            element={<Room userObj={userObj} />}
                        />
                        <Route
                            exact
                            path="/room/meeting/:roomid"
                            element={<VideoRoom userObj={userObj} />}
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
