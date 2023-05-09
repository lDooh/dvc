const db = require("../db");
const crypto = require("crypto");

function getAllUsers(callback) {
    const sql = "SELECT * FROM user";
    const pool = db.pool;

    pool.query(sql, (err, results, fields) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results);
    });
}

/**
 * Return user with matching uid
 * @param {String} uid firebase uid
 * @param {Function} callback
 * @return {Error, Array} User record of legnth 1 or 0.
 */
function findUserByUid(uid, callback) {
    const sql = "SELECT * FROM user WHERE uid = ?";
    const pool = db.pool;

    pool.query(sql, [uid], (err, results, fields) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results);
    });
}

/**
 * @param {String} uid firebase uid
 * @param {String} password can empty string
 * @param {String} nickname can empty string
 * @param {Function} callback
 * @return {Error, String, Array} Nickname string and result array.
 */
function signUpUser(uid, password, nickname, callback) {
    const sql = "INSERT INTO user VALUES (?, ?, ?)";
    const pool = db.pool;
    const nick = nickname !== "" ? nickname : crypto.randomUUID().slice(6);

    pool.query(
        sql,
        [uid, password !== "" ? password : null, nick],
        (err, results, fields) => {
            if (err) {
                return callback(err);
            }
            return callback(null, nick, results);
        }
    );
}

module.exports = {
    getAllUsers,
    findUserByUid,
    signUpUser,
};
