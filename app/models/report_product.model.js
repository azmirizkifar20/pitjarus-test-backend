"use strict";
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const ReportProduct = sequelize.define('report_product', {
        report_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        compliance: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tanggal: {
            type: DataTypes.DATE,
            allowNull: false
        },
    },{
        underscored: true,
        freezeTableName: true
    })

    return ReportProduct
}