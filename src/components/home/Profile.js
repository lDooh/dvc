import { useNavigate } from "react-router-dom";
import { authService } from "../../firebaseInstance";
import styles from "./Profile.module.css";
import { useContext } from "react";
import { SocketContext } from "../../context/clientSocket";

function Profile({ userObj }) {
    const navigate = useNavigate();
    const frontSocket = useContext(SocketContext);

    const onLogOutClick = () => {
        if (window.confirm("로그아웃 하시겠습니까?")) {
            authService.signOut();
            frontSocket.emit("logout");
            navigate("/", { replace: true });
        } else {
            return;
        }
    };

    return (
        <div className={styles["container"]}>
            <p className={styles["user-name"]}>Hello {userObj.displayName}</p>
            <button className={styles["logout"]} onClick={onLogOutClick}>
                로그아웃
            </button>
        </div>
    );
}

export default Profile;
