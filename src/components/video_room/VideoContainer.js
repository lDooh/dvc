import { useContext, useEffect, useRef, useState } from "react";
import styles from "./VideoContainer.module.css";
import { SocketContext } from "../../context/clientSocket";
import { OpenVidu } from "openvidu-browser";
import Video from "./Video";

function VideoContainer({ uid, roomId, codeOpen }) {
    const [streams, setStreams] = useState([]);
    const [OV, setOV] = useState(null);
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const frontSocket = useContext(SocketContext);
    const viderRef = useRef(null);

    useEffect(() => {
        let OV = new OpenVidu();
        setOV(OV);

        frontSocket.on("token", async (token, sessionId) => {
            let newSession = OV.initSession();

            newSession.on("streamCreated", async (event) => {
                console.log("streamCreated 이벤트");
                const stream = event.stream;
                const subscriber = newSession.subscribe(stream);

                const waitForMediaStream = setInterval(() => {
                    if (subscriber.stream.mediaStream) {
                        clearInterval(waitForMediaStream);
                        setStreams((prev) => [...prev, subscriber.stream]);
                    }
                }, 100);
            });

            newSession.on("exception", (exception) => {
                console.warn("OpenVidu session exception: ", exception);
            });

            await newSession
                .connect(token)
                .then(() => {
                    console.log("Session connection complete.");
                })
                .catch((err) => {
                    console.error("Could not connect session: ", err);
                });

            let publisher = await OV.initPublisherAsync(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
            });
            viderRef.current.srcObject = publisher.stream.mediaStream;
            setPublisher(publisher);
            newSession.publish(publisher);
            setSession(newSession);
        });

        frontSocket.emit("joinConference", uid, roomId);
    }, []);

    return (
        <div
            className={
                codeOpen ? styles.containerCodeOpen : styles.containerCodeClose
            }
        >
            <div>
                <video
                    ref={viderRef}
                    className={styles.videoWidget}
                    autoPlay
                    playsInline
                    muted
                />
                {streams.map((stream) => (
                    <Video key={stream.streamId} stream={stream} />
                ))}
            </div>
        </div>
    );
}

export default VideoContainer;
