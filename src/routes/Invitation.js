const { useContext, useEffect } = require("react");
const { useParams, useNavigate } = require("react-router-dom");
const { SocketContext } = require("../context/clientSocket");

function Invitation({ userObj }) {
    const params = useParams();
    const roomId = params.roomid;
    const frontSocket = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        frontSocket.on("invitation", (success, code) => {
            if (success) {
                navigate(`/room/${roomId}`, {
                    replace: true,
                });
            } else {
                if (code == 2) {
                    alert("이미 입장한 회의실입니다.");
                    navigate(`/room/${roomId}`, {
                        replace: true,
                    });
                } else {
                    alert("회의실 입장에 실패하였습니다.");
                    navigate(`/`, {
                        replace: true,
                    });
                }
            }
        });

        const roomPassword = prompt("회의실 비밀번호를 입력해주세요.");

        frontSocket.emit("invitation", userObj.uid, roomId, roomPassword);
    }, []);

    return <div>회의실 입장중...</div>;
}

export default Invitation;
