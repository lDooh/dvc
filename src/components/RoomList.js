import { useState } from "react";
import RoomButton from "./RoomButton";

function RoomList({ uid }) {
    const [roomList, setRoomList] = useState([]);

    const onNewRoomClick = () => {
        console.log("Create new conference room.");
    };

    return (
        <div>
            <button onClick={onNewRoomClick}>새 회의 만들기</button>
            {/* <div>
                {roomList.map((roomObj) => {
                    <RoomButton key={roomObj.room_id} roomObj={roomObj} />;
                })}
            </div> */}
        </div>
    );
}

export default RoomList;
