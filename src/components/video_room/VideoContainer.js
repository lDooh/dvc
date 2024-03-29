import { useContext, useEffect, useRef, useState } from "react";
import styles from "./VideoContainer.module.css";
import { SocketContext } from "../../context/clientSocket";
import { OpenVidu } from "openvidu-browser";
import Video from "./Video";
import CodeAuthorityModal from "./CodeAuthorityModal";

function VideoContainer({ uid, roomId, codeOpen, screenShare, isHost }) {
    const [streams, setStreams] = useState([]);
    const frontSocket = useContext(SocketContext);
    const viderRef = useRef(null);
    const camPublisher = useRef(null);
    const screenPublisher = useRef(null);
    const session = useRef(null);
    const OV = new OpenVidu();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStreamId, setSelectedStreamId] = useState("");

    const handleStreamRemoved = (streamId) => {
        setStreams((prevStreams) =>
            prevStreams.filter((stream) => stream.streamId !== streamId)
        );
    };

    function streamChange(streamId) {
        frontSocket.emit("streamId", streamId);
    }

    function onVideoClick(clickedStreamId) {
        if (isHost) {
            if (codeOpen) {
                return; // 코드 편집기가 닫혀 있는 상태에서만
            }

            setSelectedStreamId(clickedStreamId);
            setModalOpen(true);
        } else {
            return;
        }
    }

    useEffect(() => {
        frontSocket.on("token", async (token, sessionId) => {
            session.current = OV.initSession();

            session.current.on("streamCreated", async (event) => {
                const stream = event.stream;
                console.log("streamCreated 이벤트: ", stream);
                const subscriber = session.current.subscribe(stream);

                const waitForMediaStream = setInterval(() => {
                    if (subscriber.stream.mediaStream) {
                        clearInterval(waitForMediaStream);
                        setStreams((prev) => [...prev, subscriber.stream]);
                    }
                }, 100);
            });

            session.current.on("exception", (exception) => {
                console.warn("OpenVidu session exception: ", exception);
            });

            session.current.on("streamDestroyed", (event) => {
                const stream = event.stream;
                handleStreamRemoved(stream.streamId);
            });

            await session.current
                .connect(token)
                .then(() => {
                    console.log("Session connection complete.");
                })
                .catch((err) => {
                    console.error("Could not connect session: ", err);
                });

            camPublisher.current = await OV.initPublisherAsync(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
            });

            viderRef.current.srcObject =
                camPublisher.current.stream.mediaStream;
            session.current.publish(camPublisher.current);

            const waitCamPublish = setInterval(() => {
                if (camPublisher.current.stream.streamId) {
                    clearInterval(waitCamPublish);
                    streamChange(camPublisher.current.stream.streamId);
                }
            }, 100);
        });

        frontSocket.on("streamId", (isSuccess) => {
            console.log("streamId 전달: ", isSuccess);
        });

        frontSocket.emit("joinConference", uid, roomId);
    }, []);

    useEffect(() => {
        if (!camPublisher.current) {
            return;
        }

        if (screenShare) {
            console.log("화면 공유로 전환");
            if (!screenPublisher.current) {
                (async () => {
                    screenPublisher.current = await OV.initPublisherAsync(
                        undefined,
                        {
                            videoSource: "screen",
                        }
                    );

                    screenPublisher.current.once("accessAllowed", (event) => {
                        session.current.unpublish(camPublisher.current);
                        viderRef.current.srcObject =
                            screenPublisher.current.stream.mediaStream;
                        session.current.publish(screenPublisher.current);

                        const waitScreenPublish = setInterval(() => {
                            if (screenPublisher.current.stream.streamId) {
                                clearInterval(waitScreenPublish);
                                streamChange(
                                    screenPublisher.current.stream.streamId
                                );
                            }
                        }, 100);
                    });
                })();
            }
        } else {
            console.log("캠으로 전환");
            session.current.unpublish(screenPublisher.current);
            session.current.publish(camPublisher.current);

            /* const waitCamPublish = setInterval(() => {
                if (camPublisher.current.stream.streamId) {
                    clearInterval(waitCamPublish);
                    streamChange(camPublisher.current.stream.streamId);
                }
            }, 100); */
        }
    }, [screenShare]);

    return (
        <div
            className={
                codeOpen
                    ? styles["container-code-open"]
                    : styles["container-code-close"]
            }
        >
            {isHost && modalOpen && (
                <CodeAuthorityModal
                    setModalOpen={setModalOpen}
                    roomId={roomId}
                    streamId={selectedStreamId}
                />
            )}
            <div>
                <video
                    ref={viderRef}
                    className={styles["video-widget"]}
                    autoPlay
                    playsInline
                    muted
                />
                {streams.map((stream) => {
                    return (
                        <div
                            key={stream.streamId}
                            onClick={() => onVideoClick(stream.streamId)}
                        >
                            <Video stream={stream} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default VideoContainer;
