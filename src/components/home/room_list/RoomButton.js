import { useNavigate } from "react-router-dom";
import styles from "./RoomButton.module.css";

function RoomButton({ roomObj }) {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/room/${roomObj.room_id}`, {
            replace: false,
        });
    };

    return (
        <button onClick={onClick} className={styles["room-button"]}>
            {roomObj.room_title}
        </button>
    );
}

export default RoomButton;
