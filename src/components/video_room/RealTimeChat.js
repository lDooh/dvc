import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/clientSocket";
import Chatting from "../Chatting";
import styles from "./RealTimeChat.module.css";

function RealTimeChat({ uid, nickname, roomId }) {
    const frontSocket = useContext(SocketContext);
    const [msgList, setMsgList] = useState([]);
    const [msg, setMsg] = useState("");

    const onChange = (event) => {
        setMsg(event.target.value);
    };

    const onClick = () => {
        frontSocket.emit("sendRealtimeChat", uid, roomId, msg);

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

        setMsgList((prev) => [
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
        frontSocket.on(
            "receiveRealtimeChat",
            (uid, nickname, message, chatTime) => {
                setMsgList((prev) => [
                    ...prev,
                    {
                        senderId: uid,
                        senderNickname: nickname,
                        msg: message,
                        chatTime: chatTime,
                        myself: false,
                    },
                ]);
            }
        );
    }, []);

    return (
        <div className={styles["chatting-container"]}>
            <div className={styles["chat-record"]}>
                {msgList.map((msgObj, index) => (
                    <Chatting
                        key={index}
                        isConf={true}
                        uid={msgObj.senderId}
                        nickname={msgObj.senderNickname}
                        message={msgObj.msg}
                        chatTime={msgObj.chatTime}
                        myself={msgObj.myself}
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
    );
}

export default RealTimeChat;
