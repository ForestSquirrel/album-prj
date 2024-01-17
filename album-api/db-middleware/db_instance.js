const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://albumapi:12345@localhost:5432/galerydb');

initDatabase = async () => {
    try {
      await sequelize.sync();
      console.log('Database synced');
    } catch (error) {
      console.error('Unable to sync database:', error);
    }
  };

module.exports = {
    sequelize,
    initDatabase
};