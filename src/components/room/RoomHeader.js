import { useNavigate } from "react-router-dom";
import styles from "./RoomHeader.module.css";

function RoomHeader({ room_title }) {
    const navigate = useNavigate();

    const onClick = () => {
        navigate("/", { replace: false });
    };

    return (
        <div className={styles["container"]}>
            <button onClick={onClick}>뒤로</button>
            <p>{"회의실: " + room_title}</p>
        </div>
    );
}

export default RoomHeader;
