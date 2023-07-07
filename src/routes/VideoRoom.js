import { useContext, useEffect, useState } from "react";
import VideoRoomHeader from "../components/video_room/VideoRoomHeader";
import styles from "./VideoRoom.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../context/clientSocket";
import VideoContainer from "../components/video_room/VideoContainer";
import ControlBar from "../components/video_room/ControlBar";
import RealTimeChat from "../components/video_room/RealTimeChat";
import CodeEditor from "../components/video_room/CodeEditor";

function VideoRoom({ userObj }) {
    const [codeOpen, setCodeOpen] = useState(false);
    const [roomTitle, setRoomTitle] = useState("");
    const [isHost, setIsHost] = useState(false);
    const params = useParams();
    const roomId = params.roomid;
    const frontSocket = useContext(SocketContext);
    const [init, setInit] = useState(false);
    const [screenShare, setScreenShare] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        frontSocket.on("roomInfo", (roomTitle, isHost, inProgress) => {
            if (!inProgress) {
                alert("회의가 진행중이 아닙니다.");
                navigate(`/room/${roomId}`, {
                    replace: true,
                });
            }

            setRoomTitle(roomTitle);
            setIsHost(isHost);
            setInit(true);
        });

        frontSocket.emit("roomInfo", roomId, userObj.uid);
    }, []);

    return (
        <div>
            {init ? (
                <div>
                    <VideoRoomHeader
                        roomId={roomId}
                        roomTitle={roomTitle}
                        codeOpen={codeOpen}
                        setCodeOpen={setCodeOpen}
                    />
                    <div className={styles["container"]}>
                        <div
                            className={[
                                styles["video-room"],
                                codeOpen
                                    ? styles["video-room1-code-open"]
                                    : styles["video-room1-code-close"],
                            ].join(" ")}
                        >
                            <VideoContainer
                                uid={userObj.uid}
                                roomId={roomId}
                                codeOpen={codeOpen}
                                screenShare={screenShare}
                            />
                            {!codeOpen && (
                                <ControlBar
                                    isHost={isHost}
                                    setCodeOpen={setCodeOpen}
                                    setScreenShare={setScreenShare}
                                />
                            )}
                        </div>
                        {codeOpen && (
                            <div className={styles["video-room2"]}>
                                <CodeEditor roomId={roomId} />
                            </div>
                        )}
                        <div
                            className={[
                                styles["video-room"],
                                styles["video-room3"],
                            ].join(" ")}
                        >
                            <RealTimeChat
                                uid={userObj.uid}
                                nickname={userObj.displayName}
                                roomId={roomId}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                "실시간 회의 입장 중..."
            )}
        </div>
    );
}

export default VideoRoom;
