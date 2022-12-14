const ordercontroller = require("../controllers/order.controller");
const { verifySignUp } = require("../middlewares");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/account/addorder", ordercontroller.addOrder);
  app.post("/api/account/addstatus", ordercontroller.addStatus);
  app.post("/api/account/addstatus2", ordercontroller.addStatus2);
  app.get("/api/account/getallorder", ordercontroller.getAllOrders);
  app.get("/api/account/getassignedorder", ordercontroller.getAssingedOrders);
  app.post("/api/account/editorder", ordercontroller.editOrder);
  app.post("/api/account/delorder", ordercontroller.delOrder);
};
