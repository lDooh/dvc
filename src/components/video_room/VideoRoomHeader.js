import { useNavigate } from "react-router-dom";
import styles from "./VideoRoomHeader.module.css";

function VideoRoomHeader({ roomId, roomTitle, codeOpen, setCodeOpen }) {
    const navigate = useNavigate();

    const onClick = () => {
        if (codeOpen) {
            setCodeOpen(false);
        } else {
            if (window.confirm("회의실 홈으로 돌아가시겠습니까?")) {
                navigate(`/room/${roomId}`, {
                    replace: true,
                });
            } else {
                return;
            }
        }
    };

    return (
        <div className={styles["container"]}>
            <div className={styles["left"]}>
                <button onClick={onClick}>
                    {codeOpen ? "뒤로" : "회의실 홈으로"}
                </button>
            </div>
            <div>
                <span className={styles["title"]}>{roomTitle}</span>
            </div>
            <div className={styles["right"]}></div>
        </div>
    );
}

export default VideoRoomHeader;
