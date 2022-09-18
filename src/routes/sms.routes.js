const smscontroller = require("../controllers/sms.controller");
const { verifySignUp } = require("../middlewares");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/account/sendSms", smscontroller.sendSms);
};
