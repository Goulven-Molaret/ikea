const Sequelize = require('sequelize');

// Connecxion à la base de donnée
const sequelize = new Sequelize('Ikea', 'root', 'lemotdepasse',  {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Constructeur model :
const meubleConstructor = require('./meuble');
const Meuble = meubleConstructor(sequelize);
module.exports = Meuble;