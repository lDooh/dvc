import styles from "./RoomMenu.module.css";

function RoomMenu({ setCurrentMenu }) {
    const onClick = (event) => {
        setCurrentMenu(event.target.value);
    };

    return (
        <div className={styles.container}>
            <button onClick={onClick} value="home">
                회의실 홈
            </button>
            <button onClick={onClick} value="storage">
                회의 자료실
            </button>
            <button onClick={onClick} value="archive">
                회의 다시보기
            </button>
        </div>
    );
}

export default RoomMenu;
