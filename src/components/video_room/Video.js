import styles from "./Video.module.css";

function Video({ stream }) {
    return (
        <video
            className={styles.videoWidget}
            muted="true"
            controls="false"
            autoPlay="true"
            srcObject={stream}
        ></video>
    );
}

export default Video;
