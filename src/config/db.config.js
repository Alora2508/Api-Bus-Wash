module.exports = {
  HOST: "eu-cdbr-west-02.cleardb.net",
  USER: "bb3e076af20a86",
  PASSWORD: "6c1f9d67",
  DB: "heroku_c1b34ecffd33fc8",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "",
//   DB: "cleaning_system1",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };
