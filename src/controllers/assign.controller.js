const db = require("../models");

const Assign = db.assEmployee;

exports.addAssignEmployees = async (req, res) => {
  const { checkedEmployeeId, orderId } = req.body;
  try {
    Assign.destroy({
      where: {
        orderId: orderId,
      },
    })
      .then(() => {
        checkedEmployeeId.map((employeeId) => {
          Assign.create({
            orderId,
            employeeId,
          });
        });
        res.status(200).send("Assigned is Successfully");
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.getAssignEmployees = (req, res) => {
  const { orderId } = req.query;
  Assign.findAll({ where: { orderId } })
    .then((assignEmployeeInfos) => {
      const assignEmployees = [];
      // eslint-disable-next-line array-callback-return
      assignEmployeeInfos.map((assignEmployeeInfo) => {
        const { orderId, employeeId } = assignEmployeeInfo;
        const assignEmployee = {
          orderId,
          employeeId,
        };
        assignEmployees.push(assignEmployee);
      });
      res.status(200).send({ assignEmployees });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
