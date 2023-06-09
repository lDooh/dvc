import { useNavigate } from "react-router-dom";
import { authService } from "../../firebaseInstance";
import styles from "./Profile.module.css";

function Profile({ userObj }) {
    const navigate = useNavigate();

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/", { replace: true });
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
