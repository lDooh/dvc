import { useContext } from "react";
import { SocketContext } from "../../context/clientSocket";
import styles from "./CodeAuthorityModal.module.css";

function CodeAuthorityModal({ setModalOpen, roomId, streamId }) {
    const frontSocket = useContext(SocketContext);

    const closeModal = () => {
        setModalOpen(false);
    };

    const onClick = (event) => {
        const authorize = event.target.value;

        if (authorize === "yes") {
            frontSocket.emit("authorize", roomId, streamId);
        }

        closeModal();
    };

    return (
        <div className={styles["outside"]}>
            <div
                className={styles["container"]}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={closeModal}>←</button>
                <div>
                    <button onClick={onClick} value="yes">
                        확인
                    </button>
                    <button onClick={onClick} value="no">
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CodeAuthorityModal;
