const { MongoClient } = require("mongodb");

function connect(url, options = {}) {
  options = { useUnifiedTopology: true, useNewUrlParser: true, ...options };
  url = url.split('/');
  const dbName = url.pop();
  url = url.join('/');
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, options, (err, client) => {
      if (err) return reject(err);
      const db = client.db(dbName);
      client.on("connected", () => console.log("DB connecection opened."));
      client.on("disconnected", () => console.log("DB connection closed."));
      resolve(db);
    });
  });
}

module.exports = connect;
