import { useContext, useEffect, useState } from "react";
import VideoRoomHeader from "../components/video_room/VideoRoomHeader";
import styles from "./VideoRoom.module.css";
import { useParams } from "react-router-dom";
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

    useEffect(() => {
        frontSocket.on("roomTitle", (roomTitle, isHost) => {
            setRoomTitle(roomTitle);
            setIsHost(isHost);
        });

        frontSocket.emit("roomTitle", roomId, userObj.uid);
    }, []);

    return (
        <div>
            <VideoRoomHeader
                roomTitle={roomTitle}
                codeOpen={codeOpen}
                setCodeOpen={setCodeOpen}
            />
            <div className={styles.container}>
                <div
                    className={[
                        styles.videoRoom,
                        codeOpen
                            ? styles["video-room1-code-open"]
                            : styles["video-room1-code-close"],
                    ].join(" ")}
                >
                    <VideoContainer codeOpen={codeOpen} />
                    {!codeOpen && (
                        <ControlBar isHost={isHost} setCodeOpen={setCodeOpen} />
                    )}
                </div>
                {codeOpen && (
                    <div className={styles["video-room2"]}>
                        <CodeEditor />
                    </div>
                )}
                <div
                    className={[
                        styles["videoRoom"],
                        styles["video-room3"],
                    ].join(" ")}
                >
                    <RealTimeChat />
                </div>
            </div>
        </div>
    );
}

export default VideoRoom;
