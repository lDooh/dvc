const db = require("../db");

/**
 * Return uid, message, time of chatting.
 * @param {String} roomId
 * @param {Function} callback
 */
function getRoomChatByRoomId(roomId, callback) {
    const sql =
        "SELECT uid, message, chat_time FROM room_chat WHERE room_id = ? ORDER BY chat_time";
    const pool = db.pool;

    pool.query(sql, [roomId], (err, results, fields) => {
        if (err) {
            return callback(err);
        }

        return callback(null, results);
    });
}

/**
 * Save user's chat to db.
 * @param {String} uid
 * @param {String} roomId
 * @param {String} message
 * @param {Function} callback
 */
function sendNewRoomChatting(uid, roomId, message, callback) {
    const sql = "INSERT INTO room_chat VALUES(NULL, ?, ?, ?, DEFAULT)";
    const pool = db.pool;

    pool.query(sql, [roomId, uid, message], (err, results, fields) => {
        if (err) {
            return callback(err);
        }

        return callback(null, results);
    });
}

module.exports = {
    sendNewRoomChatting,
    getRoomChatByRoomId,
};
