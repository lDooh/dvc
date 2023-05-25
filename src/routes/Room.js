import { useParams } from "react-router-dom";
import RoomHeader from "../components/room/RoomHeader";
import styles from "./Room.module.css";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/clientSocket";
import RoomMenu from "../components/room/RoomMenu";
import RoomParticipants from "../components/room/RoomParticipants";
import StartConferenceButton from "../components/room/StartConferenceButton";
import RoomChat from "../components/room/RoomChat";
import RoomStorage from "../components/room/RoomStorage";
import RoomArchive from "../components/room/RoomArchive";

function Room({ userObj }) {
    const [roomTitle, setRoomTitle] = useState("");
    const params = useParams();
    const roomId = params.room_id;
    const frontSocket = useContext(SocketContext);
    const [currentMenu, setCurrentMenu] = useState("home");
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        frontSocket.on("roomTitle", (roomTitle, isHost) => {
            setRoomTitle(roomTitle);
            setIsHost(isHost);
        });

        frontSocket.emit("roomTitle", roomId, userObj.uid);
    }, []);

    return (
        <div>
            <RoomHeader room_title={roomTitle} />
            <div className={styles.container}>
                <div className={[styles.home, styles.home1].join(" ")}>
                    <RoomMenu setCurrentMenu={setCurrentMenu} />
                </div>
                <div className={[styles.home, styles.home2].join(" ")}>
                    {currentMenu === "home" && <RoomChat />}
                    {currentMenu === "storage" && <RoomStorage />}
                    {currentMenu === "archive" && <RoomArchive />}
                </div>
                <div className={[styles.home, styles.home3].join(" ")}>
                    <RoomParticipants />
                    {isHost && <StartConferenceButton />}
                </div>
            </div>
        </div>
    );
}

export default Room;
