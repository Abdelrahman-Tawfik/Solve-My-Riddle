'use strict';

const db = require("./db");
const crypto = require('crypto');

// This function returns user's information given its id.
exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Users WHERE userId = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                // By default, the local strategy looks for "username":
                // for simplicity, instead of using "email", we create an object with that property.
                const user = { userId: row.id, email: row.email, name: row.name }
                resolve(user);
            }
        });
    });
};

// This function is used at log-in time to verify username and password.
exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            }
            else {

                const user = { userId: row.userId, email: row.email, name: row.name };

                // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
                crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                    if (err){
                        console.log(err);
                        reject(err);}
                    if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });
};
exports.getUserScore = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Users WHERE userId = ?';
        db.get(sql, [userId], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row.score);
            }
        });
    });
};


exports.addToScore =async (userId,score) => {
    const oldScore = await this.getUserScore(userId);
    let updatedScore = oldScore + score ;
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Users SET score=? WHERE userId=?';
        db.run(sql, [updatedScore, userId], (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};

exports.getTop3 = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT userId,name,score FROM Users WHERE score >= (SELECT MIN(score) FROM (SELECT DISTINCT (score) FROM Users ORDER BY score DESC LIMIT 3)) ';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
};



