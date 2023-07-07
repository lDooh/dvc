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
    const roomId = params.roomid;
    const frontSocket = useContext(SocketContext);
    const [currentMenu, setCurrentMenu] = useState("home");
    const [isHost, setIsHost] = useState(false);
    const [init, setInit] = useState(false);

    useEffect(() => {
        frontSocket.on("roomTitle", (roomTitle, isHost) => {
            setRoomTitle(roomTitle);
            setIsHost(isHost);
            setInit(true);
        });

        frontSocket.emit("roomTitle", roomId, userObj.uid);
    }, []);

    return (
        <div>
            {init ? (
                <div>
                    <RoomHeader room_title={roomTitle} />
                    <div className={styles["container"]}>
                        <div
                            className={[styles["room"], styles["room1"]].join(
                                " "
                            )}
                        >
                            <RoomMenu
                                currentMenu={currentMenu}
                                setCurrentMenu={setCurrentMenu}
                            />
                        </div>
                        <div
                            className={[styles["room"], styles["room2"]].join(
                                " "
                            )}
                        >
                            {currentMenu === "home" && <RoomChat />}
                            {currentMenu === "storage" && (
                                <RoomStorage
                                    roomId={roomId}
                                    userObj={userObj}
                                />
                            )}
                            {currentMenu === "archive" && <RoomArchive />}
                        </div>
                        <div
                            className={[styles["room"], styles["room3"]].join(
                                " "
                            )}
                        >
                            <RoomParticipants />
                            {
                                <StartConferenceButton
                                    isHost={isHost}
                                    roomId={roomId}
                                />
                            }
                        </div>
                    </div>
                </div>
            ) : (
                "회의실 입장중..."
            )}
        </div>
    );
}

export default Room;
