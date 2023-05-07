const db = require("../db");

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

module.exports = {
    getAllUsers,
};
