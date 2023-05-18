function RoomHeader({ roomObj }) {
    return (
        <div>
            <button>뒤로</button>
            <p>{roomObj.roomName}</p>
        </div>
    );
}

export default RoomHeader;
