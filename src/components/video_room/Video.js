import { useEffect, useRef } from "react";
import styles from "./Video.module.css";

function Video({ stream }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream.mediaStream) {
            console.log("peer의 미디어 스트림");
            videoRef.current.srcObject = stream.mediaStream;
        }
    }, [stream]);

    return (
        <video
            className={styles.videoWidget}
            ref={videoRef}
            autoPlay
            playsInline
        ></video>
    );
}

export default Video;
