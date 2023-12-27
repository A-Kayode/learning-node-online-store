const Sequelize = require('sequelize');

const sequelize = new Sequelize.Sequelize('learning-node', 'root', 'Damnation.', {dialect:'mysql', host: 'localhost'});

module.exports = sequelize;