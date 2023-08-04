const MongoStore = require("connect-mongo");

const store = MongoStore.create({
  mongoUrl: process.env.DATABASE_URI,
  ttl: 1 * 24 * 60 * 60, //1 day
  touchAfter: 24 * 3600, // time period in seconds
});

module.exports = store;
