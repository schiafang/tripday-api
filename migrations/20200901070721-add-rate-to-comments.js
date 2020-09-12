'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Comments', 'rate', Sequelize.STRING, {
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Comments', 'rate');
  }
};
