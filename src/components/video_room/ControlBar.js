function ControlBar({ isHost, setCodeOpen }) {
    const onClick = (event) => {
        const {
            target: { name, value },
        } = event;

        if (value === "editor") {
            setCodeOpen(true);
        }
    };

    return (
        <div>
            <button>화면 녹화</button>
            <button>화면 공유</button>
            <button onClick={onClick} value="editor">
                코드 편집기
            </button>
            <button>회의 종료</button>
        </div>
    );
}

export default ControlBar;
