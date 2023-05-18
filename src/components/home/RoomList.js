import { useState } from "react";
import styles from "./RoomList.module.css";
import CreateRoomModal from "./room_list/CreateRoomModal";

function RoomList({ frontSocket, userObj }) {
    const [roomList, setRoomList] = useState([]);
    const [createRoomOpen, setCreateRoomOpen] = useState(false);

    const onNewRoomClick = () => {
        console.log("Create new conference room.");
    };

    const showCreateRoomModal = () => {
        setCreateRoomOpen(true);
    };

    return (
        <div className={styles.container}>
            <button onClick={showCreateRoomModal}>새 회의 만들기</button>
            {/* <div>
                {roomList.map((roomObj) => {
                    <RoomButton key={roomObj.room_id} roomObj={roomObj} />;
                })}
            </div> */}
            {createRoomOpen && (
                <CreateRoomModal
                    setCreateRoomOpen={setCreateRoomOpen}
                    frontSocket={frontSocket}
                    uid={userObj.uid}
                />
            )}
            {/* for layout test */}
            <div className={styles.buttonContainer}>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
                <button className={styles.roomButton}>버튼</button>
            </div>
        </div>
    );
}

export default RoomList;
