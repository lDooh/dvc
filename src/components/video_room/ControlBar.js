import { useContext } from "react";
import styles from "./ControlBar.module.css";
import { SocketContext } from "../../context/clientSocket";
import { useNavigate } from "react-router-dom";

function ControlBar({ isHost, setCodeOpen, setScreenShare, roomId }) {
    const frontSocket = useContext(SocketContext);
    const navigate = useNavigate();

    const onClick = (event) => {
        const {
            target: { name, value },
        } = event;

        if (value === "recording") {
            console.log("회의 녹화");
        } else if (value == "share") {
            setScreenShare((prev) => !prev);
        } else if (value == "editor") {
            setCodeOpen(true);
        } else if (value === "end") {
            console.log("회의 종료");
            frontSocket.emit("endConference");

            if (
                window.confirm(
                    "회의를 종료하고 회의실 홈으로 돌아가시겠습니까?"
                )
            ) {
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
            <button onClick={onClick} value="recording">
                화면 녹화
            </button>
            <button onClick={onClick} value="share">
                화면 공유
            </button>
            <button onClick={onClick} value="editor">
                코드 편집기
            </button>
            <button onClick={onClick} value="end">
                {isHost ? "회의 종료" : "회의 나가기"}
            </button>
        </div>
    );
}

export default ControlBar;
