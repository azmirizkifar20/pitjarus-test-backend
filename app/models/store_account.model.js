"use strict";
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const StoreAccount = sequelize.define('store_account', {
        report_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },{
        underscored: true,
        freezeTableName: true
    })

    return StoreAccount
}