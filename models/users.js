const express = require('express');
const Sequelize = require('sequelize');

const db = require('./../config/database.js');

module.exports = db.define('User', {
  // Model attributes are defined here
  id: {
    type: Sequelize.INTEGER,
    primaryKey : true,
    allowNull : false,
    autoIncrement: true
  },
  email: {
    type: Sequelize.TEXT,
    allowNull : false
  },
   username : {
    type : Sequelize.STRING
  },
  password : {
      type : Sequelize.STRING
  } 
});
