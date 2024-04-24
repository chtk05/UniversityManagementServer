const db = require("./connection.js");
const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};
const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

const queryAsync = async (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = { comparePassword, hashPassword, queryAsync };
