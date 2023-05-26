import { useState } from "react";
import styles from "./VideoContainer.module.css";

function VideoContainer({ codeOpen }) {
    const [streams, setStreams] = useState([]);

    return (
        <div
            className={
                codeOpen ? styles.containerCodeOpen : styles.containerCodeClose
            }
        >
            비디오들이 표시될 공간입니다.
        </div>
    );
}

export default VideoContainer;
