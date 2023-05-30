import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/clientSocket";
import { useNavigate } from "react-router-dom";

function StartConferenceButton({ isHost, roomId }) {
    const frontSocket = useContext(SocketContext);
    const navigate = useNavigate();
    const [startSuccess, setStartSuccess] = useState(false);
    const [getStartBoolean, setGetStartBoolean] = useState(false);

    useEffect(() => {
        frontSocket.on("startConference", (isStart) => {
            setGetStartBoolean((prev) => true);

            if (isStart) {
                setStartSuccess((prev) => true);
            }
        });
    }, []);

    const onClick = () => {
        if (isHost) {
            frontSocket.emit("startConference", roomId);
        } else {
            navigate(`/room/meeting/${roomId}`, {
                replace: false,
            });
        }
    };

    useEffect(() => {
        if (getStartBoolean) {
            if (startSuccess) {
                navigate(`/room/meeting/${roomId}`, {
                    replace: false,
                });
            } else {
                setGetStartBoolean(false);
                alert("회의를 시작하지 못하였습니다.");
            }
        }
    }, [getStartBoolean]);

    return (
        <div>
            <button onClick={onClick}>
                {isHost ? "회의 시작" : "회의 참가"}
            </button>
        </div>
    );
}

export default StartConferenceButton;
