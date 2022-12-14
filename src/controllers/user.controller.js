const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const config = require("../config/auth.config");

const JWT_SECRET = config.secret;
const JWT_EXPIRES_IN = 86400;
const User = db.user;
const Garage = db.garage;
const Company = db.company;
const { ROLES } = db;

exports.getUsers = (req, res) => {
  User.findAll().then(async (users) => {
    const userList = [];
    users.map((user) => {
      const { id, name, phoneNumber, roleId } = user;
      userList.push({
        id,
        name,
        phoneNumber,
        roleId: ROLES[roleId - 1].toUpperCase(),
      });
    });
    res.status(200).send({ userList });
  });
};

exports.getEmployees = (req, res) => {
  User.findAll({ where: { roleId: 2 } }).then(async (employeeInfos) => {
    const employees = await getEmployeeData(employeeInfos);
    res.status(200).send({ employees });
  });
};

async function getEmployeeData(employeeInfos) {
  const asyncRes = await Promise.all(
    employeeInfos.map(async (employeeInfo) => {
      const { id, name, phoneNumber, roleId } = employeeInfo;
      const garageData = await Garage.findOne({ where: { userId: id } });
      const { garage } = garageData;
      const employee = {
        id,
        name,
        phoneNumber,
        garage,
        roleId: ROLES[roleId - 1].toUpperCase(),
      };
      return employee;
    })
  );
  return asyncRes;
}

exports.getCustomers = (req, res) => {
  User.findAll({ where: { roleId: 3 } }).then(async (customerInfos) => {
    const customers = await getCustomerData(customerInfos);
    res.status(200).send({ customers });
  });
};

async function getCustomerData(customerInfos) {
  const asyncRes = await Promise.all(
    customerInfos.map(async (customerInfo) => {
      const { id, name, phoneNumber, roleId } = customerInfo;
      const garageData = await Garage.findOne({ where: { userId: id } });
      const { garage } = garageData;
      const companyData = await Company.findOne({ where: { userId: id } });
      const { companyName } = companyData;
      const customer = {
        id,
        name,
        phoneNumber,
        garage,
        companyName,
        roleId: ROLES[roleId - 1].toUpperCase(),
      };
      return customer;
    })
  );
  return asyncRes;
}

exports.editProfile = (req, res) => {
  User.findOne({
    where: {
      name: req.body.name,
    },
  })
    .then((userInfo) => {
      const passwordIsValid = bcrypt.compareSync(
        req.body.oldPassword,
        userInfo.password
      );

      if (!passwordIsValid) {
        return res.status(500).send({
          accessToken: null,
          message: "Wrong Old Password!",
        });
      }

      User.update(
        {
          password: bcrypt.hashSync(req.body.newPassword, 8),
        },
        { where: { name: req.body.name } }
      )
        .then(() => {
          res.status(200).send({ message: "update is success" });
        })
        .catch((error) =>
          res.status(500).send({ message: "update is unsuccessfull" })
        );
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getProfile = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send("Not authorization!");
  }

  const accessToken = authorization.split(" ")[1];
  const { userId } = jwt.verify(accessToken, JWT_SECRET);

  User.findOne({
    where: {
      id: userId,
    },
  })
    .then((userInfo) => {
      const user = {
        id: userInfo.id,
        name: userInfo.name,
        phoneNumber: userInfo.phoneNumber,
        roleId: ROLES[userInfo.roleId - 1].toUpperCase(),
      };
      res.status(200).send({ user });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.addEmployee = (req, res) => {
  const { name, phoneNumber, garage } = req.body;
  const password = "password";
  const roleId = 2;

  User.create({
    name,
    phoneNumber,
    password: bcrypt.hashSync(password, 8),
    roleId,
  })
    .then((employeeInfo) => {
      Garage.create({
        userId: employeeInfo.id,
        garage,
      }).then((garageInfo) => {
        const employee = {
          id: employeeInfo.id,
          name: employeeInfo.name,
          phoneNumber: employeeInfo.phoneNumber,
          garage: garageInfo.garage,
          roleId: ROLES[employeeInfo.roleId - 1].toUpperCase(),
        };
        res.status(200).send({ employee });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.addCustomer = (req, res) => {
  const { companyName, inCharge, phoneNumber, garage } = req.body;
  const password = "password";
  const roleId = 3;
  User.create({
    name: inCharge,
    phoneNumber,
    password: bcrypt.hashSync(password, 8),
    roleId,
  })
    .then((customerInfo) => {
      Garage.create({
        userId: customerInfo.id,
        garage,
      }).then((garageInfo) => {
        Company.create({
          userId: customerInfo.id,
          companyName,
        }).then((companyInfo) => {
          const customer = {
            id: customerInfo.id,
            companyName: companyInfo.companyName,
            inCharge: customerInfo.name,
            phoneNumber: customerInfo.phoneNumber,
            garage: garageInfo.garage,
            roleId: ROLES[customerInfo.roleId - 1].toUpperCase(),
          };
          res.status(200).send({ customer });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.editEmployee = (req, res) => {
  const { id, name, phoneNumber, garage } = req.body;
  User.update(
    {
      name,
      phoneNumber,
    },
    { where: { id } }
  )
    .then((response) => {
      if (response[0]) {
        Garage.update(
          {
            garage,
          },
          { where: { userId: id } }
        );
        res.status(200).send({ message: "update is success" });
      } else res.status(500).send({ message: "update is failed" });
    })
    .catch((err) => res.status(500).send({ message: err }));
};

exports.editCustomer = (req, res) => {
  const { companyName, inCharge, phoneNumber, garage, id } = req.body;
  User.update(
    {
      name: inCharge,
      phoneNumber,
    },
    { where: { id } }
  )
    .then((response) => {
      if (response[0]) {
        Garage.update(
          {
            garage,
          },
          { where: { userId: id } }
        );
        Company.update(
          {
            companyName,
          },
          { where: { userId: id } }
        );
      }
      res.status(200).send("update is success");
    })
    .catch(() => res.status(500).send("update is unsuccessfull"));
};

exports.delEmployee = async (req, res) => {
  const { employeeId } = req.body;
  User.destroy({
    where: {
      id: employeeId,
    },
  }).then((response) => {
    if (response) res.status(200).send({ message: "Delete is success!" });
    else res.status(500).send({ message: "Delete is failed!" });
  });
};

exports.delCustomer = (req, res) => {
  const { customerId } = req.body;
  User.destroy({
    where: {
      id: customerId,
    },
  });
  res.status(200).send("success");
};
