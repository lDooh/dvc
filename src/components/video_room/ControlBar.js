function ControlBar({ isHost, setCodeOpen, setScreenShare }) {
    const onClick = (event) => {
        const {
            target: { name, value },
        } = event;

        if (value === "recording") {
            console.log("회의 녹화");
        } else if (value == "share") {
            setScreenShare((prev) => !prev);
        } else if (value == "editor") {
            setCodeOpen(true);
        } else if (value === "end") {
            console.log("회의 종료");
        }
    };

    return (
        <div>
            <button onClick={onClick} value="recording">
                화면 녹화
            </button>
            <button onClick={onClick} value="share">
                화면 공유
            </button>
            <button onClick={onClick} value="editor">
                코드 편집기
            </button>
            <button onClick={onClick} value="end">
                {isHost ? "회의 종료" : "회의 나가기"}
            </button>
        </div>
    );
}

export default ControlBar;
