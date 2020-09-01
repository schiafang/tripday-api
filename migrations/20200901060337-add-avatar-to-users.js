'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'avatar', Sequelize.STRING, {
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'avatar');
  }
};
