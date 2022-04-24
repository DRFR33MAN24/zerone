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
 
  module.exports = new Sequelize("react_electron", "gordon_123", "160d754a", {
   host: "db4free.net:3306",
   dialect: "mysql"
 });
 
