const db = require("../db");

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
    getRoomByUid,
};
