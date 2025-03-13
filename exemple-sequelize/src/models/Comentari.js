const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comentari = sequelize.define('Comentari', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contingut: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'comentaris'
});

module.exports = Comentari;