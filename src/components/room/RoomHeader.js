function RoomHeader({ roomObj }) {
    return (
        <div>
            <button>뒤로</button>
            <p>{roomObj.room_title}</p>
        </div>
    );
}

export default RoomHeader;
