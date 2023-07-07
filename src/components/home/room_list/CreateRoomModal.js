import { useContext, useState } from "react";
import styles from "./CreateRoomModal.module.css";
import { SocketContext } from "../../../context/clientSocket";

function CreateRoomModal({ setCreateRoomOpen, uid }) {
    const [roomName, setRoomName] = useState("");
    const frontSocket = useContext(SocketContext);

    const closeCreateRoomModal = () => {
        setCreateRoomOpen(false);
    };

    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;

        setRoomName(value);
    };

    const onSubmit = (event) => {
        event.preventDefault();

        frontSocket.emit("createRoom", uid, roomName);
        if (true) {
            console.log("New conference room created.");
        } else {
            // TODO: 회의실 생성 실패 시 동작
            console.error("Failed to create new conference room");
        }
        alert("회의실을 생성하였습니다.");
        setCreateRoomOpen(false);
    };

    return (
        <div className={styles["outside"]}>
            <div
                className={styles["container"]}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={closeCreateRoomModal}>←</button>
                <form onSubmit={onSubmit}>
                    <input
                        name="roomName"
                        type="text"
                        placeholder="회의실 이름"
                        required
                        value={roomName}
                        onChange={onChange}
                    />
                    <input type="submit" value="회의실 만들기" />
                </form>
            </div>
        </div>
    );
}

export default CreateRoomModal;
