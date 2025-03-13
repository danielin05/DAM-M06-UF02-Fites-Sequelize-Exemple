const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

//VALORACIO TIPUS 1 = Like, Y TIPUS 0 = Dislike

const Valoracio = sequelize.define('Valoracio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipus: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'valoracions'
});

module.exports = Valoracio;