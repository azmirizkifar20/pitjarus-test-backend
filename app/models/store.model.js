"use strict";
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const Store = sequelize.define('store', {
        store_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        store_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        area_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_active: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },{
        underscored: true,
        freezeTableName: true
    })

    return Store
}