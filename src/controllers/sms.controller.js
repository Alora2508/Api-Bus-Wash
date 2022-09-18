const db = require("../models");

const axios = require("axios");
const { SMS_API } = require("../config/config");

const User = db.user;

exports.sendSms = (req, res) => {
  if (req.body.phonenumber) {
    axios({
      url: "https://api.cpsms.dk/v2/send",
      method: "POST",
      headers: {
        Authorization: `Basic ${SMS_API}`,
        "Content-Type": "application/json",
      },
      data: {
        to: req.body.phonenumber,
        message: req.body.sms,
        from: "BUSWASH APS",
        timestamp: 1474970400,
      },
    })
      .then((res) => {
        console.log("This is result", res);
        res.status(200).send({ send: "ok" });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    req.body.userId.map((id, index) => {
      User.findOne({
        where: {
          id: id,
        },
      })
        .then((userInfo) => {
          const { phoneNumber } = userInfo;
          axios({
            url: "https://api.cpsms.dk/v2/send",
            method: "POST",
            headers: {
              Authorization: `Basic ${SMS_API}`,
              "Content-Type": "application/json",
            },
            data: {
              to: phoneNumber,
              message: req.body.sms,
              from: "BUSWASH APS",
              timestamp: 1474970400,
            },
          })
            .then((res) => {
              console.log("This is result", res);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    });
  }
};
