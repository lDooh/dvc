function VideoRoomHeader({ roomTitle, codeOpen, setCodeOpen }) {
    const onClick = () => {
        setCodeOpen(false);
    };

    return (
        <div>
            {codeOpen && <button onClick={onClick}>뒤로</button>}
            {"실시간 회의: " + roomTitle}
        </div>
    );
}

export default VideoRoomHeader;
