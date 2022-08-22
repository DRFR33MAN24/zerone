const { Sequelize } = require("sequelize");

//module.exports = new Sequelize(
// "react_electron",
//"phpmyadmin",
//"blackmesa",
// {
//   host: "localhost",
//   dialect: "mysql"
// }
//);

//module.exports = new Sequelize("sql11476034", "sql11476034", "KmMLrgeq35", {
// host: "sql11.freesqldatabase.com",
// dialect: "mysql"
//});

//   module.exports = new Sequelize("react_electron", "gordon_123", "160d754a", {
//    host: "db4free.net:3306",
//    dialect: "mysql"
//  });

module.exports = new Sequelize("drfr33man24", "drfr33man24", "blackmesa-123", {
  host: "localhost",
  dialect: "mysql",
	logging:false,
  pool: {
    max: 90,
    min:0,
  },
});
