import { useNavigate } from "react-router-dom";
import styles from "./RoomButton.module.css";

function RoomButton({ roomObj }) {
    const navigate = useNavigate();

    const onClick = () => {
        console.log(`회의실 ${roomObj.room_title} 로 이동`);

        navigate(`/room/${roomObj.room_id}`, {
            replace: false,
        });
    };

    return (
        <button onClick={onClick} className={styles.roomButton}>
            {roomObj.room_title}
        </button>
    );
}

export default RoomButton;
