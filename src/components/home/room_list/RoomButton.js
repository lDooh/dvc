import styles from "./RoomButton.module.css";

function RoomButton({ roomObj }) {
    return <button className={styles.roomButton}>{roomObj.room_title}</button>;
}

export default RoomButton;
