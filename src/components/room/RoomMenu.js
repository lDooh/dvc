import { useEffect } from "react";
import styles from "./RoomMenu.module.css";

function RoomMenu({ currentMenu, setCurrentMenu }) {
    const onClick = (event) => {
        setCurrentMenu(event.target.value);
    };

    return (
        <div className={styles["container"]}>
            <button
                className={currentMenu === "home" && styles["selected"]}
                onClick={onClick}
                value="home"
            >
                회의실 홈
            </button>
            <button
                className={currentMenu === "storage" && styles["selected"]}
                onClick={onClick}
                value="storage"
            >
                회의 자료실
            </button>
            <button
                className={currentMenu === "archive" && styles["selected"]}
                onClick={onClick}
                value="archive"
            >
                회의 다시보기
            </button>
        </div>
    );
}

export default RoomMenu;
