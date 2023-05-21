const db = require("../db");
const crypto = require("crypto");

/**
 * Create new conference room by uid and room title.
 * @param {String} uid host user uid
 * @param {String} roomTitle
 * @param {Function} callback
 */
function createRoom(uid, roomTitle, callback) {
    const sql = "INSERT INTO room VALUES (?, ?, ?)";
    const pool = db.pool;
    const roomId = crypto.randomUUID();

    pool.query(sql, [roomId, uid, roomTitle], (err, results, fields) => {
        if (err) {
            return callback(err);
        }

        const _sql = "INSERT INTO participation VALUES(?, ?)";
        pool.query(_sql, [roomId, uid], (_err, _results, _fields) => {
            if (_err) {
                return callback(_err);
            }
        });
        return callback(null, results);
    });
}

/**
 * Returns the room in which the user is participating
 * @param {String} uid
 * @param {Function} callback
 */
function getRoomByUid(uid, callback) {
    const sql =
        "SELECT room.* FROM room JOIN participation ON room.room_id = participation.room_id WHERE participation.uid = ?";
    const pool = db.pool;

    pool.query(sql, [uid], (err, results, fields) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results);
    });
}

module.exports = {
    createRoom,
    getRoomByUid,
};
