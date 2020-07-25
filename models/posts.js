const Sequelize = require('sequelize')

const db = require('./../config/database.js');


module.exports = db.define('post', {
  // Model attributes are defined here
  id: {
    type: Sequelize.INTEGER,
    primaryKey : true,
    allowNull : false,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,

  },
  description: {
    type: Sequelize.TEXT
  },
  markdown : {
    type : Sequelize.TEXT
  }
});
