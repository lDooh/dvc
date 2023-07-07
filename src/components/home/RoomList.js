import { useContext, useEffect, useState } from "react";
import styles from "./RoomList.module.css";
import CreateRoomModal from "./room_list/CreateRoomModal";
import { SocketContext } from "../../context/clientSocket";
import RoomButton from "./room_list/RoomButton";

function RoomList({ userObj }) {
    const [roomList, setRoomList] = useState([]);
    const [createRoomOpen, setCreateRoomOpen] = useState(false);
    const frontSocket = useContext(SocketContext);

    useEffect(() => {
        frontSocket.on("getRooms", (rooms) => {
            // console.log("참여한 회의실들: ", rooms);
            setRoomList(rooms);
        });
        frontSocket.emit("getRooms", userObj.uid);
    }, []);

    const showCreateRoomModal = () => {
        setCreateRoomOpen(true);
    };

    return (
        <div className={styles["container"]}>
            <button
                className={styles["new-button"]}
                onClick={showCreateRoomModal}
            >
                새 회의 만들기
            </button>
            {createRoomOpen && (
                <CreateRoomModal
                    setCreateRoomOpen={setCreateRoomOpen}
                    uid={userObj.uid}
                />
            )}
            <div className={styles["button-container"]}>
                {roomList.map((roomObj) => (
                    <RoomButton key={roomObj.room_id} roomObj={roomObj} />
                ))}
            </div>
        </div>
    );
}

export default RoomList;
