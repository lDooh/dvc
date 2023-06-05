import styles from "./Chatting.module.css";

function Chatting({ isConf, uid, nickname, message, chatTime, myself }) {
    return (
        <div
            className={[
                styles["chat-common"],
                isConf ? styles["chat-conference"] : styles["chat-room"],
                myself ? styles["myself"] : styles["not-myself"],
            ].join(" ")}
        >
            <div>
                <span className={styles["nickname-span"]}>{nickname}</span>
                <span>{chatTime}</span>
            </div>
            <div>{message}</div>
        </div>
    );
}

export default Chatting;
