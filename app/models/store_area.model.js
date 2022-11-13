"use strict";
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const StoreArea = sequelize.define('store_area', {
        area_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        area_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },{
        underscored: true,
        freezeTableName: true
    })

    return StoreArea
}