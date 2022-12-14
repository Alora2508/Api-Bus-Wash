const express = require("express");
// eslint-disable-next-line no-unused-vars
// const bcrypt = require('bcryptjs');
const cors = require("cors");

const app = express();
const bodyParser = require("body-parser");

const corsOptions = {
  origin: "http://localhost:8080",
  live: "http://www.buswash.dk",
};

app.use(cors(corsOptions.origin));
app.use(cors(corsOptions.live));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// eslint-disable-next-line no-unused-vars
// const db = require('./models');

// db.sequelize.sync({ force: true }).then(() => {
//   initial();
// });

// const initial = () => {
//   const User = db.user;
//   const Role = db.role;
//   const Bus = db.bus;
//   const Driver = db.driver;
//   const Garage = db.garage;

//   User.create({
//     name: 'admin',
//     phoneNumber: '1234567980',
//     roleId: 1,
//     password: bcrypt.hashSync('admin', 8),
//   });

// Role.create({
//   roleId: 1,
//   role: 'admin',
// });

// Role.create({
//   roleId: 2,
//   role: 'employee',
// });

// Role.create({
//   roleId: 3,
//   role: 'customer',
// });
// };

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/bus.routes")(app);
require("./routes/driver.routes")(app);
require("./routes/order.routes")(app);
require("./routes/assign.routes")(app);
require("./routes/sms.routes")(app);

module.exports = app;
