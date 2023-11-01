const db = require("../db");
const crypto = require("crypto");

/**
 * Create new conference room by uid and room title.
 * @param {String} uid host user uid
 * @param {String} roomTitle
 * @param {Function} callback
 */
function createRoom(uid, roomTitle, callback) {
    const sql = "INSERT INTO room VALUES (?, ?, ?, DEFAULT, DEFAULT)";
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
        return callback(null, results, roomId);
    });
}

/**
 * Return whether conference is in progress.
 * @param {String} roomId
 * @param {Function} callback
 */
/* function isInProgress(roomId, callback) {
    const sql = "SELECT inProgress FROM room WHERE room_id = ?";
    const pool = db.pool;

    pool.query(sql, [roomId], (err, results, fields) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results);
    });
} */

/**
 * Start real time video conference.
 * @param {String} roomId
 * @param {Function} callback
 */
function startConference(roomId, callback) {
    const sql = "UPDATE room SET inProgress = ? WHERE room_id = ?";
    const pool = db.pool;

    pool.query(sql, [true, roomId], (err, results, fields) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results);
    });
}

/**
 * End real time video conference.
 * @param {String} roomId
 * @param {Function} callback
 */
function endConferenceByUid(uid, callback) {
    const sql = "UPDATE room SET inProgress = ? WHERE uid = ?";
    const pool = db.pool;

    pool.query(sql, [false, uid], (err, results, fields) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results);
    });
}

/**
 * Return room informtaion.
 * @param {String} roomId
 * @param {Function} callback
 */
function getRoomByRoomId(roomId, callback) {
    const sql = "SELECT * FROM room WHERE room_id = ?";
    const pool = db.pool;

    pool.query(sql, [roomId], (err, results, fields) => {
        if (err) {
            return callback(err);
        }
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

/**
 * Returns whether the user participated in the room or not. If user is participating return 1, or return 0.
 * @param {String} uid
 * @param {String} roomId
 */
function getParticipationByUidAndRoomId(uid, roomId, callback) {
    const sql =
        "SELECT COUNT(uid) AS COUNT FROM participation WHERE room_id = ? AND uid = ?";
    const pool = db.pool;

    pool.query(sql, [roomId, uid], (err, results, fields) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results);
    });
}

/**
 * Return password correct. If password is correct return 1, or return 0
 * @param {String} roomId
 * @param {String} roomPassword
 * @param {Function} callback
 */
function checkRoomPassword(roomId, roomPassword, callback) {
    const sql =
        "SELECT COUNT(room_id) AS COUNT FROM room WHERE room_id = ? AND (room_password = ? OR room_password IS NULL)";
    const pool = db.pool;

    pool.query(sql, [roomId, roomPassword], (err, results, fields) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results);
    });
}

/**
 * Join the user in the room.
 * @param {String} uid
 * @param {String} roomId
 * @param {Function} callback
 */
function enterRoomByRoomId(uid, roomId, callback) {
    const sql = "INSERT INTO participation VALUES (?, ?)";
    const pool = db.pool;

    pool.query(sql, [roomId, uid], (err, results, fields) => {
        if (err) {
            return callback(err);
        }

        return callback(null, results);
    });
}

module.exports = {
    createRoom,
    // isInProgress,
    startConference,
    endConferenceByUid,
    getRoomByRoomId,
    getRoomByUid,
    getParticipationByUidAndRoomId,
    checkRoomPassword,
    enterRoomByRoomId,
};
