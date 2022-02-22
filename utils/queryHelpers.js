const sqlite3 = require("sqlite3").verbose();

const readQuery = (dbName, sql, params) => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(`./db/${dbName}.db`);

    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });

    db.close();
  });
};

const writeQuery = (dbName, sql, params) => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(`./db/${dbName}.db`);

    db.run(sql, params, function (err) {
      if (err) {
        reject(err.message);
      }
      resolve(this.changes);
    });

    db.close();
  });
};

module.exports = {
  readQuery,
  writeQuery,
};
