import { useContext, useEffect, useRef, useState } from "react";
import styles from "./RoomChat.module.css";
import { SocketContext } from "../../context/clientSocket";
import Chatting from "../Chatting";

function RoomChat({ uid, nickname, roomId }) {
    const frontSocket = useContext(SocketContext);
    const [msg, setMsg] = useState("");
    const [chatList, setChatList] = useState([]);
    const [init, setInit] = useState(true);
    const [chatOffset, setChatOffset] = useState(0);
    const chatRecordRef = useRef(null);

    const onChange = (event) => {
        setMsg(event.target.value);
    };

    const onClick = () => {
        const currentMsg = msg.trim();
        if (currentMsg.length === 0) {
            console.log("메시지를 입력해주세요.");
            return;
        }

        frontSocket.emit("sendRoomChat", uid, nickname, roomId, msg);

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        let hour = currentDate.getHours();
        const minute = String(currentDate.getMinutes()).padStart(2, "0");

        let period = "오전";
        if (hour >= 12) {
            period = "오후";
            hour -= 12;
        }

        const formattedDate = `${year}/${month}/${day} ${period} ${hour}:${minute}`;

        setChatList((prev) => [
            ...prev,
            {
                senderId: uid,
                senderNickname: nickname,
                msg: msg,
                chatTime: formattedDate,
                myself: true,
            },
        ]);
        setMsg("");
    };

    useEffect(() => {
        frontSocket.on("roomChatRecord", (chatObjList) => {
            chatObjList.reverse();
            setChatList((prev) => [...chatObjList, ...prev]);
            setInit(true);
        });

        frontSocket.on(
            "receiveRoomChat",
            (uid, nickname, message, chatTime) => {
                setChatList((prev) => {
                    return [
                        ...prev,
                        {
                            senderId: uid,
                            senderNickname: nickname,
                            msg: message,
                            chatTime: chatTime,
                            myself: false,
                        },
                    ];
                });
            }
        );

        frontSocket.emit("roomChatRecord", uid, roomId, 10, chatOffset);
        setChatOffset((prev) => prev + 10);
    }, []);

    const onChatScroll = () => {
        const scrollTop = chatRecordRef.current.scrollTop;

        if (scrollTop === 0) {
            frontSocket.emit("roomChatRecord", uid, roomId, 10, chatOffset);
            setChatOffset((prev) => prev + 10);
        }
    };

    return (
        <div className={styles["chatting-container"]}>
            {init ? (
                <div>
                    <div
                        className={styles["chat-record"]}
                        ref={chatRecordRef}
                        onScroll={onChatScroll}
                    >
                        {chatList.map((chatObj, idx) => (
                            <Chatting
                                key={idx}
                                isConf={false}
                                uid={chatObj.setderId}
                                nickname={chatObj.senderNickname}
                                message={chatObj.msg}
                                chatTime={chatObj.chatTime}
                                myself={chatObj.myself}
                            />
                        ))}
                    </div>
                    <div className={styles["chat-input"]}>
                        <textarea
                            className={styles[""]}
                            value={msg}
                            onChange={onChange}
                        />
                        <button className={styles[""]} onClick={onClick}>
                            전송
                        </button>
                    </div>
                </div>
            ) : (
                "채팅창 로딩 중..."
            )}
        </div>
    );
}

export default RoomChat;
