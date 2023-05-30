import { useNavigate } from "react-router-dom";

function VideoRoomHeader({ roomId, roomTitle, codeOpen, setCodeOpen }) {
    const navigate = useNavigate();

    const onClick = () => {
        if (codeOpen) {
            setCodeOpen(false);
        } else {
            if (window.confirm("회의실 홈으로 돌아가시겠습니까?")) {
                navigate(`/room/${roomId}`, {
                    replace: true,
                });
            } else {
                return;
            }
        }
    };

    return (
        <div>
            <button onClick={onClick}>
                {codeOpen ? "뒤로" : "회의실 홈으로"}
            </button>
            {"실시간 회의: " + roomTitle}
        </div>
    );
}

export default VideoRoomHeader;
