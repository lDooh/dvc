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

/**
 * Return nickname.
 * @param {String} uid
 * @param {Function} callback
 */
async function findNicknameByUid(uid) {
    const sql = "SELECT nickname FROM user WHERE uid = ?";
    const pool = db.pool.promise();
    const result = {};

    try {
        const [row, fields] = await pool.query(sql, [uid]);

        result["state"] = true;
        result["nickname"] = row[0]["nickname"];
        return result;
    } catch (err) {
        console.error("findNicknameByUid catch error: ", err);
        result["state"] = false;
        return result;
    } finally {
    }
}

module.exports = {
    getAllUsers,
    findUserByUid,
    signUpUser,
    findNicknameByUid,
};
