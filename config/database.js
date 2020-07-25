const Sequelize = require('sequelize')

module.exports = new Sequelize('blog', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});
