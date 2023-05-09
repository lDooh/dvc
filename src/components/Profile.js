import { useNavigate } from "react-router-dom";
import { authService } from "../firebaseInstance";

function Profile({ userObj }) {
    const navigate = useNavigate();

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/", { replace: true });
    };

    return (
        <div>
            <p>Hello {userObj.displayName}</p>
            <button onClick={onLogOutClick}>로그아웃</button>
        </div>
    );
}

export default Profile;
