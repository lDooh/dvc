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
            if (isStart) {
                setStartSuccess(true);
                setGetStartBoolean(true);
            }
        });
    }, []);

    const onClick = () => {
        if (isHost) {
            frontSocket.emit("startConference", roomId);

            const checkGetStartBoolean = setInterval(() => {
                if (getStartBoolean) {
                    clearInterval(checkGetStartBoolean);

                    if (startSuccess) {
                        navigate(`/room/meeting/${roomId}`, {
                            replace: false,
                        });
                    } else {
                        alert("회의를 시작하지 못하였습니다.");
                    }
                }
            }, 100);
        } else {
            navigate(`/room/meeting/${roomId}`, {
                replace: false,
            });
        }
    };

    return (
        <div>
            <button onClick={onClick}>
                {isHost ? "회의 시작" : "회의 참가"}
            </button>
        </div>
    );
}

export default StartConferenceButton;
