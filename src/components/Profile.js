import { useNavigate } from "react-router-dom";
import { authService } from "../firebaseInstance";

function Profile() {
    const navigate = useNavigate();

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/", { replace: true });
    };

    return (
        <div>
            <button onClick={onLogOutClick}>로그아웃</button>
        </div>
    );
}

export default Profile;
