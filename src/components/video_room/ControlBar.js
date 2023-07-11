import { useContext, useEffect } from "react";
import styles from "./ControlBar.module.css";
import { SocketContext } from "../../context/clientSocket";

function ControlBar({ isHost, setCodeOpen, setScreenShare }) {
    const frontSocket = useContext(SocketContext);
    const isRecording = false;

    const onClick = (event) => {
        const {
            target: { name, value },
        } = event;

        if (value === "recording") {
            if (isRecording) {
                frontSocket.emit("stop_recording");
            } else {
                frontSocket.emit("start_recording");
            }
        } else if (value == "share") {
            setScreenShare((prev) => !prev);
        } else if (value == "editor") {
            setCodeOpen(true);
        } else if (value === "end") {
            console.log("회의 종료");
        }
    };

    return (
        <div className={styles["container"]}>
            <button onClick={onClick} value="recording">
                {isRecording ? "녹화 중지" : "회의 녹화"}
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
